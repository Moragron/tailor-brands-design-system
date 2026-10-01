// Offline self-test of the extraction pipeline (capture probe → derive-tokens → tokens.css).
//
// The live site can't always be reached (it couldn't from the environment this repo was built in),
// so this proves the extraction logic on a site we control: the built Storybook screens.
// Those screens render from the current tokens, so a correct pipeline must derive the same
// values back out. Writes only to a temp dir — never touches reference/ or tokens/.
//
//   npm run research:build-storybook && npm run research:selftest
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { COMMON_ROLES, SCREENS } from './flow.config.mjs';
import { PROPS, probe, histogram } from './probe.mjs';

const rootDir = new URL('..', import.meta.url).pathname;
const sbDir = join(rootDir, 'storybook-static');
if (!existsSync(join(sbDir, 'index.json'))) { console.error('Run `npm run research:build-storybook` first.'); process.exit(1); }

const tmp = mkdtempSync(join(tmpdir(), 'tb-selftest-'));
const stylesDir = join(tmp, 'styles/');
mkdirSync(stylesDir);
const tokensJson = join(tmp, 'tokens.json');
copyFileSync(join(rootDir, '../tokens/tokens.json'), tokensJson);
const expected = JSON.parse(readFileSync(tokensJson, 'utf8'));

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer((req, res) => {
  const p = join(sbDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = existsSync(p) && !p.endsWith('/') ? p : join(p, 'index.html');
  if (!existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

let browser;
try { browser = await chromium.launch(); }
catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const index = JSON.parse(readFileSync(join(sbDir, 'index.json'), 'utf8'));
const screenStories = Object.values(index.entries).filter((e) => e.title === 'Research/Onboarding flow' && /^S\d\d /.test(e.name) && !e.name.includes('—'));
for (const story of screenStories) {
  const num = story.name.slice(1, 3);
  const screen = SCREENS.find((s) => s.id.startsWith(`${num}-`));
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-tb-story]');
  await page.waitForTimeout(2000); // let the entity "Thinking" state resolve
  const roles = await page.evaluate(probe, { specs: [...COMMON_ROLES, ...(screen.roles ?? []), ...(screen.before ?? [])], PROPS });
  roles.histogram = await page.evaluate(histogram);
  writeFileSync(join(stylesDir, `${screen.id}.json`), JSON.stringify({ screen: screen.id, roles }, null, 2));
  const found = Object.entries(roles).filter(([k, v]) => k !== 'histogram' && v).map(([k]) => k);
  console.log(`probed ${screen.id}: ${found.join(', ')}`);
}
await browser.close();
server.close();

execFileSync('node', [join(rootDir, 'scripts/derive-tokens.mjs')], { stdio: 'inherit', env: { ...process.env, TB_STYLES_DIR: stylesDir, TB_TOKENS_JSON: tokensJson } });
const derived = JSON.parse(readFileSync(tokensJson, 'utf8'));

// Round-trip assertions: tokens whose role is rendered by the Storybook screens.
const get = (t, path) => path.split('.').reduce((n, k) => n?.[k], t);
const norm = (v) => String(v).replace(/\s+/g, '').toLowerCase();
const CHECKS = [
  'color.text.primary', 'color.action.primary-bg', 'color.action.primary-fg', 'color.action.primary-disabled-bg',
  'color.border.default', 'color.chip.border', 'color.banner.bg', 'font.size.h1', 'font.size.body', 'font.weight.h1',
  'radius.button', 'radius.input', 'radius.chip', 'space.base',
];
let failed = 0;
for (const path of CHECKS) {
  const want = get(expected, path).$value;
  const got = get(derived, path);
  const ok = got.$observed && norm(got.$value) === norm(want);
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${path}: expected ${want}, derived ${got.$value}${got.$observed ? ` from ${got.$source}` : ' (not resolved)'}`);
}
console.log(`\n${CHECKS.length - failed}/${CHECKS.length} round-trip checks passed · temp output: ${tmp}`);
process.exit(failed ? 1 : 0);
