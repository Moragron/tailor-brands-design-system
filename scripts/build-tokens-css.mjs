// tokens/tokens.json (source of truth) -> generated files under src/styles/, so they ship to
// connected Lovable projects (attach copies src/, not tokens/):
//   tokens.css          CSS custom properties (--tb-*), each with a provenance comment
//   theme.css           Tailwind 4 `@theme inline` mapping: bg-tb-action-primary-bg, text-tb-h1, rounded-tb-card …
//   shadcn.css          shadcn/ui theme variables pointed at the tokens (Tailwind 4 / full colour values)
//   tw3/preset.ts       Tailwind 3 preset with the same utility names as theme.css
//   tw3/shadcn.css      shadcn/ui theme variables as HSL triplets (Tailwind 3 shadcn format)
// Run `npm run tokens:css` after editing tokens/tokens.json. Never edit the outputs by hand.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const jsonPath = process.env.TB_TOKENS_JSON ?? new URL('../tokens/tokens.json', import.meta.url).pathname;
// The research self-test points TB_TOKENS_JSON at a temp copy; write next to it so it never touches src/.
const outDir = process.env.TB_TOKENS_OUT_DIR
  ?? (process.env.TB_TOKENS_JSON ? dirname(jsonPath) : new URL('../src/styles', import.meta.url).pathname);
const tokens = JSON.parse(readFileSync(jsonPath, 'utf8'));
const status = tokens.$meta.status.toUpperCase();
const lines = [];
const tailwind = [];
const preset = { colors: {}, borderRadius: {}, boxShadow: {}, fontFamily: {}, fontSize: {}, fontWeight: {}, lineHeight: {} };
const values = {};

// Tailwind theme namespaces per token group (v4 variable prefix, v3 theme key). Groups without a
// namespace (space, breakpoint, layout, effect) stay CSS-variable only: p-(--tb-space-4) on
// Tailwind 4, p-[var(--tb-space-4)] on Tailwind 3.
function twName(path) {
  const [group, sub, ...rest] = path;
  const tail = (parts) => parts.join('-');
  if (group === 'color') return ['--color-tb-', 'colors', tail([sub, ...rest])];
  if (group === 'radius') return ['--radius-tb-', 'borderRadius', tail([sub, ...rest])];
  if (group === 'shadow') return ['--shadow-tb-', 'boxShadow', tail([sub, ...rest])];
  if (group === 'font' && sub === 'family') return ['--font-tb-', 'fontFamily', tail(rest)];
  if (group === 'font' && sub === 'size') return ['--text-tb-', 'fontSize', tail(rest)];
  if (group === 'font' && sub === 'weight') return ['--font-weight-tb-', 'fontWeight', tail(rest)];
  if (group === 'font' && sub === 'line-height') return ['--leading-tb-', 'lineHeight', tail(rest)];
  return null;
}

function walk(node, path) {
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith('$') || typeof val !== 'object' || val === null) continue;
    if ('$value' in val) {
      const name = `--tb-${[...path, key].join('-')}`;
      // Provenance (source file, evidence) stays in tokens.json; the CSS only says whether it was measured.
      const provenance = val.$observed ? 'measured' : 'placeholder';
      // $fallback (font stacks) is appended so apps without the licensed font degrade gracefully.
      const value = val.$fallback ? `${val.$value}, ${val.$fallback}` : val.$value;
      values[name] = val.$value;
      lines.push(`  ${name}: ${value}; /* ${provenance}${val.$fallback ? ' + fallback stack' : ''} */`);
      const tw = twName([...path, key]);
      if (tw) {
        const [prefix, key3, util] = tw;
        tailwind.push(`  ${prefix}${util}: var(${name});`);
        preset[key3][`tb-${util}`] = `var(${name})`;
      }
    } else {
      walk(val, [...path, key]);
    }
  }
}
walk(tokens, []);

// depth.css colours (opt-in, not in tokens.json). The utilities exist always but only resolve
// when depth.css is imported.
for (const util of ['glow', 'divider']) {
  tailwind.push(`  --color-tb-${util}: var(--tb-color-${util}); /* depth.css only */`);
  preset.colors[`tb-${util}`] = `var(--tb-color-${util})`;
}

// shadcn/ui theme variables -> tokens. Lovable apps start from shadcn/ui; pointing its variables at
// the tokens keeps any shadcn component outside this design system's catalog on-brand.
const shadcn = {
  background: 'color-surface-page', foreground: 'color-text-primary',
  card: 'color-surface-card', 'card-foreground': 'color-text-primary',
  popover: 'color-surface-card', 'popover-foreground': 'color-text-primary',
  primary: 'color-action-primary-bg', 'primary-foreground': 'color-action-primary-fg',
  secondary: 'color-action-secondary-bg', 'secondary-foreground': 'color-action-secondary-fg',
  muted: 'color-surface-muted', 'muted-foreground': 'color-text-muted',
  accent: 'color-surface-muted', 'accent-foreground': 'color-text-primary',
  destructive: 'color-feedback-error', 'destructive-foreground': 'color-action-primary-fg',
  border: 'color-border-default', input: 'color-border-default', ring: 'color-action-primary-bg',
  sidebar: 'color-surface-card', 'sidebar-foreground': 'color-text-body',
  'sidebar-primary': 'color-action-primary-bg', 'sidebar-primary-foreground': 'color-action-primary-fg',
  'sidebar-accent': 'color-surface-muted', 'sidebar-accent-foreground': 'color-text-primary',
  'sidebar-border': 'color-border-default', 'sidebar-ring': 'color-action-primary-bg',
};

function hexToHsl(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`shadcn bridge: ${hex} is not a #rrggbb colour`);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  const round = (n) => Math.round(n * 10) / 10;
  return `${round(h)} ${round(s * 100)}% ${round(l * 100)}%`;
}

const generated = `GENERATED by scripts/build-tokens-css.mjs from tokens/tokens.json — do not edit by hand.`;
const write = (file, content) => {
  const path = join(outDir, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
};

write('tokens.css', `/*
 * ${generated}
 * Token set status: ${status}
 */
:root {
${lines.join('\n')}
}
`);

write('theme.css', `/*
 * ${generated}
 * Tailwind 4 theme mapping, imported by styles/index.css. \`inline\` keeps utilities pointing at the
 * --tb-* variables, so re-capturing tokens restyles them.
 * Token set status: ${status}
 */
@theme inline {
${tailwind.join('\n')}
}
`);

const shadcnV4 = Object.entries(shadcn).map(([v, t]) => `  --${v}: var(--tb-${t});`);
write('shadcn.css', `/*
 * ${generated}
 * OPTIONAL bridge for Tailwind 4 apps that also use shadcn/ui: points shadcn's theme variables at the
 * design-system tokens, so shadcn components outside this catalog still look on-brand.
 * :root:root outranks the app's own :root block regardless of import order.
 * The design system has no dark theme, so .dark keeps these light values.
 */
:root:root {
${shadcnV4.join('\n')}
  --radius: var(--tb-radius-card);
}
`);

const shadcnV3 = Object.entries(shadcn).map(([v, t]) => {
  const name = v === 'sidebar' ? 'sidebar-background' : v; // shadcn v3 naming
  return `  --${name}: ${hexToHsl(values[`--tb-${t}`])}; /* --tb-${t} */`;
});
write('tw3/shadcn.css', `/*
 * ${generated}
 * OPTIONAL bridge for Tailwind 3 apps that also use shadcn/ui. shadcn on Tailwind 3 reads its colours
 * as HSL triplets (hsl(var(--primary))), so the token values are converted here.
 * :root:root outranks the app's own :root block regardless of import order.
 * The design system has no dark theme, so .dark keeps these light values.
 */
:root:root {
${shadcnV3.join('\n')}
  --radius: var(--tb-radius-card);
}
`);

write('tw3/preset.ts', `/*
 * ${generated}
 * Tailwind 3 preset with the same utility names as the Tailwind 4 theme (bg-tb-*, text-tb-*, rounded-tb-*,
 * shadow-tb-*, font-tb-*, leading-tb-*). In tailwind.config.ts:
 *   import tbPreset from './src/design-system/<slug>/styles/tw3/preset';
 *   export default { presets: [tbPreset], content: [...] };
 * Values are var(--tb-*), so styles/tw3/index.css (which defines them) must be imported too.
 */
const preset = {
  theme: {
    extend: ${JSON.stringify(preset, null, 2).replace(/\n/g, '\n    ')},
  },
};

export default preset;
`);

console.log(`wrote ${outDir}: tokens.css (${lines.length} properties, status: ${tokens.$meta.status}), theme.css (${tailwind.length} Tailwind variables), shadcn.css, tw3/preset.ts, tw3/shadcn.css`);
