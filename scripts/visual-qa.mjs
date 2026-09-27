// Visual QA: screenshots every story from the static Storybook build and places it next to its
// reference capture, with a pixel diff where a reference exists.
//
//   npm run build-storybook && npm run qa   →  qa-report/index.html
//
// Pairing: each story's `parameters.reference` is rendered by ReferencePanel as data attributes.
//  - screen stories (Onboarding flow/*) are compared with the full reference screenshot;
//  - component stories with a `role` are compared with the reference cropped to that role's
//    bounding box from reference/styles/<screenshot>.json.
// Stories whose diff exceeds FLAG_THRESHOLD are flagged for manual review.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const FLAG_THRESHOLD = 0.15; // share of differing pixels
const rootDir = new URL('..', import.meta.url).pathname;
const sbDir = join(rootDir, 'storybook-static');
const refDir = join(rootDir, 'reference');
const outDir = join(rootDir, 'qa-report');
const shotDir = join(outDir, 'shots');
mkdirSync(shotDir, { recursive: true });
if (!existsSync(join(sbDir, 'index.json'))) { console.error('Run `npm run build-storybook` first.'); process.exit(1); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const p = join(sbDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = existsSync(p) && !p.endsWith('/') ? p : join(p, 'index.html');
  if (!existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(readFileSync(join(sbDir, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.title.startsWith('Tokens'));

async function launch() {
  try { return await chromium.launch(); }
  catch (e) { if (existsSync('/opt/pw-browsers/chromium')) return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); throw e; }
}
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => console.warn(`  page error: ${e.message}`));

const readPng = (p) => PNG.sync.read(readFileSync(p));
function crop(png, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, Math.max(0, x), Math.max(0, y), Math.min(w, png.width - x), Math.min(h, png.height - y), 0, 0);
  return out;
}
function diff(a, b, outPath) {
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const ca = crop(a, { x: 0, y: 0, w, h }), cb = crop(b, { x: 0, y: 0, w, h });
  const d = new PNG({ width: w, height: h });
  const n = pixelmatch(ca.data, cb.data, d.data, w, h, { threshold: 0.1 });
  writeFileSync(outPath, PNG.sync.write(d));
  // Size mismatch counts as difference too: compare against the union area.
  const union = Math.max(a.width, b.width) * Math.max(a.height, b.height);
  return (n + (union - w * h)) / union;
}

const rows = [];
for (const s of stories) {
  await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-tb-story]', { timeout: 10000 });
  await page.waitForTimeout(300);
  const built = `shots/${s.id}.png`;
  await page.locator('[data-tb-story]').screenshot({ path: join(outDir, built) });
  const ref = await page.evaluate(() => {
    const a = document.querySelector('[data-reference-screenshot]');
    return a ? { screenshot: a.dataset.referenceScreenshot, role: a.dataset.referenceRole } : null;
  });
  const row = { id: s.id, title: `${s.title} / ${s.name}`, built, ref, refImg: null, diffImg: null, score: null, note: '' };
  const refPath = ref && join(refDir, 'screenshots', ref.screenshot);
  if (!ref) row.note = 'No reference assigned (proposal / variant story).';
  else if (!existsSync(refPath)) row.note = `Reference ${ref.screenshot} not captured yet.`;
  else {
    let refPng = readPng(refPath);
    if (ref.role) {
      const stylesPath = join(refDir, 'styles', ref.screenshot.replace(/\.png$/, '.json'));
      const rect = existsSync(stylesPath) ? JSON.parse(readFileSync(stylesPath, 'utf8')).roles?.[ref.role]?.rect : null;
      if (rect) refPng = crop(refPng, rect);
      else row.note = `Role "${ref.role}" not found in capture — compared against full screenshot.`;
    }
    row.refImg = `shots/${s.id}__ref.png`;
    writeFileSync(join(outDir, row.refImg), PNG.sync.write(refPng));
    row.diffImg = `shots/${s.id}__diff.png`;
    row.score = diff(readPng(join(outDir, built)), refPng, join(outDir, row.diffImg));
  }
  rows.push(row);
  console.log(`${row.score == null ? '·' : row.score > FLAG_THRESHOLD ? '⚠' : '✓'} ${row.title}${row.score != null ? ` — ${(row.score * 100).toFixed(1)}% differ` : ` — ${row.note}`}`);
}
await browser.close();
server.close();

const flagged = rows.filter((r) => r.score != null && r.score > FLAG_THRESHOLD);
const compared = rows.filter((r) => r.score != null);
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const html = `<!doctype html><meta charset="utf-8"><title>Visual QA</title>
<style>
body{font:14px/1.5 system-ui,sans-serif;margin:24px;color:#222}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}
img{max-width:420px;max-height:420px;border:1px solid #ddd}.flag{background:#fff3f0}.none{color:#888;font-style:italic}
</style>
<h1>Visual QA — built stories vs live-site captures</h1>
<p>Generated ${new Date().toISOString()}. ${stories.length} stories · ${compared.length} compared against a reference · <strong>${flagged.length} flagged</strong> (&gt; ${FLAG_THRESHOLD * 100}% of pixels differ).</p>
${compared.length === 0 ? '<p><strong>No reference captures exist yet</strong>, so this report only shows the built side. Run <code>npm run capture</code> on a network that can reach tailorbrands.com, then <code>npm run tokens &amp;&amp; npm run build-storybook &amp;&amp; npm run qa</code>.</p>' : ''}
<p>Scores are a coarse screen for large deltas, not a pass/fail: AI-personalised copy and dynamic content on the live site will always differ.</p>
<table><tr><th>Story</th><th>Built</th><th>Reference</th><th>Diff</th></tr>
${rows.map((r) => `<tr class="${r.score > FLAG_THRESHOLD ? 'flag' : ''}"><td><strong>${esc(r.title)}</strong><br>${r.ref ? `ref: <code>${esc(r.ref.screenshot)}</code>${r.ref.role ? ` · role <code>${esc(r.ref.role)}</code>` : ''}<br>` : ''}${r.score != null ? `${(r.score * 100).toFixed(1)}% differ${r.score > FLAG_THRESHOLD ? ' ⚠ flagged' : ''}` : ''}<div class="none">${esc(r.note)}</div></td>
<td><img src="${r.built}" loading="lazy"></td><td>${r.refImg ? `<img src="${r.refImg}" loading="lazy">` : '<span class="none">—</span>'}</td><td>${r.diffImg ? `<img src="${r.diffImg}" loading="lazy">` : '<span class="none">—</span>'}</td></tr>`).join('\n')}
</table>`;
writeFileSync(join(outDir, 'index.html'), html);
console.log(`\nqa-report/index.html — ${compared.length} compared, ${flagged.length} flagged`);
