// reference/styles/*.json (captured computed styles) -> tokens/tokens.json -> tokens/tokens.css
//
// Every token in tokens.json declares a `$derive` rule, e.g. "primaryButton.backgroundColor".
// This script resolves each rule against the captures, takes the most frequent value across
// onboarding screens (falling back to homepage/pricing only when the role never appears in the
// flow), and records `$source` + `$evidence` so each value can be audited back to a capture.
// Tokens that can't be resolved keep their placeholder and stay `$observed: false`.
// A human-readable audit trail is written to reference/styles/_derivation.md.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Overridable so selftest-pipeline.mjs can run against a temp dir without touching the real files.
const stylesDir = process.env.TB_STYLES_DIR ?? new URL('../reference/styles/', import.meta.url).pathname;
const tokensPath = process.env.TB_TOKENS_JSON ?? new URL('../tokens/tokens.json', import.meta.url).pathname;
// Always start from the baseline (rules + placeholders) so a re-run never keeps a stale observed value.
const basePath = process.env.TB_TOKENS_BASE ?? new URL('../tokens/tokens.base.json', import.meta.url).pathname;
const tokens = JSON.parse(readFileSync(existsSync(basePath) ? basePath : tokensPath, 'utf8'));

// Desktop captures only (mobile files carry an @<width> suffix); onboarding screens first.
const files = existsSync(stylesDir)
  ? readdirSync(stylesDir).filter((f) => f.endsWith('.json') && !f.startsWith('_') && !f.includes('@')).sort()
  : [];
if (!files.length) {
  console.error('No captures in reference/styles/. Run `npm run capture` first (needs network access to tailorbrands.com).');
  process.exit(1);
}
const captures = files.map((f) => ({ file: f, ...JSON.parse(readFileSync(stylesDir + f, 'utf8')) }));
const isOnboarding = (c) => !/^00-/.test(c.file);

const toHex = (v) => {
  if (v === 'rgba(0, 0, 0, 0)') return 'transparent';
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(v ?? '');
  if (!m || (m[4] !== undefined && Number(m[4]) !== 1)) return v;
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`;
};

function resolve(rule) {
  for (const alt of rule.split('|')) {
    const [role, prop] = alt.split('.');
    for (const pool of [captures.filter(isOnboarding), captures.filter((c) => !isOnboarding(c))]) {
      const hits = pool
        .map((c) => ({ file: c.file, v: c.roles?.[role]?.styles?.[prop] }))
        .filter((x) => x.v !== undefined && x.v !== null && x.v !== '' && x.v !== 'none')
        // A transparent background usually means "painted by a parent", so it isn't evidence; a
        // transparent border, though, is a real design decision (e.g. borderless cards).
        .filter((x) => !(prop === 'backgroundColor' && x.v === 'rgba(0, 0, 0, 0)'));
      if (!hits.length) continue;
      const counts = {};
      hits.forEach((x) => { counts[x.v] = (counts[x.v] ?? 0) + 1; });
      const [value, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      const first = hits.find((x) => x.v === value);
      return {
        value,
        source: `reference/styles/${first.file}#roles.${role}.styles.${prop}`,
        evidence: `${n}/${hits.length} captures agree`,
        conflicts: Object.keys(counts).filter((k) => k !== value),
      };
    }
  }
  return null;
}

// Spacing base unit from the page-wide histograms of onboarding screens.
function inferSpacing() {
  const counts = {};
  captures.filter(isOnboarding).forEach((c) => {
    Object.entries(c.roles?.histogram?.spacing ?? {}).forEach(([v, n]) => {
      const px = parseFloat(v);
      if (v.endsWith('px') && px > 0) counts[px] = (counts[px] ?? 0) + n;
    });
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return null;
  const share = (unit) => Object.entries(counts).filter(([px]) => Number(px) % unit === 0).reduce((a, [, n]) => a + n, 0) / total;
  const s8 = share(8), s4 = share(4);
  const base = s8 >= 0.8 ? 8 : s4 >= 0.8 ? 4 : null;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([px, n]) => `${px}px×${n}`).join(', ');
  return { base, evidence: `${Math.round(s8 * 100)}% of ${total} spacing values divisible by 8, ${Math.round(s4 * 100)}% by 4. Most common: ${top}` };
}

function inferBreakpoints() {
  const p = `${stylesDir}_media.json`;
  if (!existsSync(p)) return null;
  const media = JSON.parse(readFileSync(p, 'utf8'));
  const widths = {};
  Object.entries(media).forEach(([q, { count }]) => {
    for (const m of q.matchAll(/(min|max)-width:\s*([\d.]+)px/g)) {
      const w = Math.round(Number(m[2]) + (m[1] === 'max' ? 1 : 0)); // max-width:767px ≡ breakpoint 768
      widths[w] = (widths[w] ?? 0) + count;
    }
  });
  // Merge widths within 2px (e.g. max-width:719px and min-width:720px describe the same breakpoint).
  const merged = {};
  Object.entries(widths).sort((a, b) => b[1] - a[1]).forEach(([w, n]) => {
    const near = Object.keys(merged).find((m) => Math.abs(Number(m) - Number(w)) <= 2);
    merged[near ?? w] = (merged[near ?? w] ?? 0) + n;
  });
  Object.keys(widths).forEach((k) => delete widths[k]);
  Object.assign(widths, merged);
  const top = Object.entries(widths).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => Number(w)).sort((a, b) => a - b);
  return top.length ? { top, evidence: Object.entries(widths).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w, n]) => `${w}px×${n}`).join(', ') } : null;
}

const report = ['# Token derivation audit', '', `Generated ${new Date().toISOString()} from ${files.length} captures.`, '', '| Token | Value | Observed | Source | Evidence | Other values seen |', '|---|---|---|---|---|---|'];
let found = 0, total = 0;
const spacing = inferSpacing();
const bps = inferBreakpoints();

function walk(node, path) {
  for (const [key, t] of Object.entries(node)) {
    if (key.startsWith('$') || typeof t !== 'object' || t === null) continue;
    if (!('$value' in t)) { walk(t, [...path, key]); continue; }
    const name = [...path, key].join('.');
    total++;
    let r = null;
    if (t.$derive === 'histogram:spacing' && spacing?.base) r = { value: `${spacing.base}px`, source: 'reference/styles/*.json#roles.histogram.spacing', evidence: spacing.evidence, conflicts: [] };
    else if (t.$derive?.startsWith('base*') && spacing?.base) r = { value: `${spacing.base * Number(t.$derive.slice(5))}px`, source: 'space.base × multiplier (inferred)', evidence: 'derived from inferred base unit', conflicts: [] };
    else if (t.$derive === 'media' && bps) {
      const i = ['sm', 'md', 'lg'].indexOf(key);
      if (bps.top[i] !== undefined) r = { value: `${bps.top[i]}px`, source: 'reference/styles/_media.json', evidence: bps.evidence, conflicts: [] };
    } else if (t.$derive && !t.$derive.startsWith('histogram') && !t.$derive.startsWith('base*') && t.$derive !== 'media') r = resolve(t.$derive);

    if (r) {
      found++;
      t.$value = t.$type === 'color' ? toHex(r.value) : r.value;
      t.$observed = true;
      t.$source = r.source;
      t.$evidence = r.evidence;
      delete t.$note;
    } else {
      t.$observed = false;
      t.$source = null;
      if (t.$derive) t.$note = `UNKNOWN — rule "${t.$derive}" matched nothing in the captures; placeholder kept.`;
    }
    report.push(`| \`${name}\` | \`${t.$value}\` | ${t.$observed ? 'yes' : '**no**'} | ${t.$source ?? '—'} | ${t.$evidence ?? t.$note ?? ''} | ${r?.conflicts?.map((c) => `\`${c}\``).join(', ') ?? ''} |`);
  }
}
walk(tokens, []);

tokens.$meta = {
  status: found === total ? 'observed' : found ? 'partial' : 'placeholder',
  statusNote: `${found}/${total} tokens resolved from live captures; the rest are placeholders flagged $observed:false. See reference/styles/_derivation.md.`,
  generatedBy: 'scripts/derive-tokens.mjs',
  generatedAt: new Date().toISOString(),
};
writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`);
writeFileSync(`${stylesDir}_derivation.md`, `${report.join('\n')}\n`);
console.log(`resolved ${found}/${total} tokens -> tokens/tokens.json (status: ${tokens.$meta.status})`);
execFileSync('node', [new URL('./build-tokens-css.mjs', import.meta.url).pathname], { stdio: 'inherit' });
