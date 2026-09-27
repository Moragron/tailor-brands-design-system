// Walks the Tailor Brands onboarding flow with Playwright and records, per screen:
//   reference/screenshots/<id>.png       full-page screenshot (+ arrival / interaction shots)
//   reference/dom/<id>.html, <id>.css    raw DOM + every stylesheet the page loaded
//   reference/styles/<id>.json           getComputedStyle() for each UI role + page-wide histogram
//   reference/styles/_media.json         every @media condition seen (breakpoint evidence)
//   reference/CAPTURE_LOG.md             what ran, what failed, and why
//
// Usage:
//   npm run capture                                  # full run from the homepage
//   npm run capture -- --start-url <onboarding url>  # resume inside an existing session
//   npm run capture -- --viewport 390x844            # mobile pass (files suffixed @390)
//   npm run capture -- --headed                      # watch it / step in manually
import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { COMMON_ROLES, SCREENS, HOME_URL, PRICING_URLS } from './flow.config.mjs';
import { PROPS, probe, histogram } from './probe.mjs';

const root = new URL('../reference/', import.meta.url).pathname;
const dirs = { shots: `${root}screenshots/`, dom: `${root}dom/`, styles: `${root}styles/` };
Object.values(dirs).forEach((d) => mkdirSync(d, { recursive: true }));

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const [vw, vh] = (arg('--viewport') ?? '1440x900').split('x').map(Number);
const suffix = vw === 1440 ? '' : `@${vw}`;
const startUrl = arg('--start-url');
const headed = args.includes('--headed');

const logPath = `${root}CAPTURE_LOG.md`;
const log = (line) => { console.log(line); appendFileSync(logPath, `${line}\n`); };

async function collectCss(page) {
  const sheets = await page.evaluate(() => [...document.styleSheets].map((s) => {
    try { return { href: s.href, text: [...s.cssRules].map((r) => r.cssText).join('\n') }; }
    catch { return { href: s.href, text: null }; }
  }));
  let css = '';
  for (const s of sheets) {
    let t = s.text;
    if (t == null && s.href) {
      try { t = await (await page.request.get(s.href)).text(); } catch { t = `/* could not fetch ${s.href} */`; }
    }
    css += `\n/* ===== ${s.href ?? 'inline <style>'} ===== */\n${t ?? ''}\n`;
  }
  return css;
}

const mediaPath = `${dirs.styles}_media.json`;
const media = existsSync(mediaPath) ? JSON.parse(readFileSync(mediaPath, 'utf8')) : {};
function recordMedia(css, id) {
  for (const m of css.matchAll(/@media([^{]+)\{/g)) {
    const q = m[1].trim();
    media[q] ??= { count: 0, screens: [] };
    media[q].count++;
    if (!media[q].screens.includes(id)) media[q].screens.push(id);
  }
}

// ---------- run ----------
async function launch() {
  try { return await chromium.launch({ headless: !headed }); }
  catch (e) {
    const fallback = '/opt/pw-browsers/chromium';
    if (!existsSync(fallback)) throw e;
    return chromium.launch({ headless: !headed, executablePath: fallback });
  }
}

const browser = await launch();
const context = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
const page = await context.newPage();

const h = {
  async screenshot(name, opts = { fullPage: true }) {
    await page.screenshot({ path: `${dirs.shots}${name}${suffix}.png`, ...opts });
  },
  async captureRoles(name, specs) {
    const roles = await page.evaluate(probe, { specs, PROPS });
    writeFileSync(`${dirs.styles}${name}${suffix}.json`, JSON.stringify({ screen: name, url: page.url(), viewport: { w: vw, h: vh }, capturedAt: new Date().toISOString(), roles }, null, 2));
    return roles;
  },
  async clickText(re, { optional = false } = {}) {
    const byRole = page.getByRole('button', { name: re });
    const target = (await byRole.count()) ? byRole.first() : page.getByText(re).first();
    try { await target.click({ timeout: 8000 }); }
    catch (e) { if (!optional) throw new Error(`could not click ${re}: ${e.message.split('\n')[0]}`); }
  },
  async fillFirstInput(value) {
    const input = page.locator('input[type=text], input:not([type]), input[type=search], textarea').filter({ visible: true }).first();
    await input.click({ timeout: 8000 });
    await input.fill('');
    await input.pressSequentially(value, { delay: 40 });
    await page.waitForTimeout(800);
  },
  async clickFirstChip() {
    const roles = await page.evaluate(probe, { specs: [{ role: 'chip', selectors: ['[role=checkbox]', '[aria-pressed]', 'label', 'button'], chip: true }], PROPS });
    if (!roles.chip) throw new Error('no chip-like element found');
    const { x, y, w, h: ht } = roles.chip.rect;
    await page.mouse.click(x + w / 2, y - (await page.evaluate(() => scrollY)) + ht / 2);
  },
};

writeFileSync(logPath, existsSync(logPath) ? readFileSync(logPath, 'utf8') : '# Capture log\n');
log(`\n## Run ${new Date().toISOString()} — viewport ${vw}x${vh}${startUrl ? `, resumed at ${startUrl}` : ''}\n`);

let screens = SCREENS;
if (startUrl) {
  const seg = startUrl.split('/').filter(Boolean).pop();
  const idx = SCREENS.findIndex((s) => s.id.replace(/^\d+-/, '') === seg);
  if (idx < 0) throw new Error(`--start-url segment "${seg}" does not match any screen id`);
  screens = SCREENS.slice(idx);
  try { await page.goto(startUrl, { waitUntil: 'domcontentloaded' }); }
  catch (e) { log(`- ❌ ${startUrl} — ${e.message.split('\n')[0]}`); screens = []; }
} else {
  // Pricing first (standalone pages), then the flow from the homepage.
  for (const url of PRICING_URLS) {
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      if (res && res.ok()) {
        await h.screenshot('00-pricing');
        writeFileSync(`${dirs.dom}00-pricing${suffix}.html`, await page.content());
        await h.captureRoles('00-pricing', [...COMMON_ROLES, { role: 'pricingCard', selectors: ['div', 'section', 'article'], text: '^\\s*essential', climbToBox: true }, { role: 'badge', selectors: ['*'], text: '^popular$', leaf: true }]);
        log(`- ✅ 00-pricing (${url})`);
      } else log(`- ⚠️ 00-pricing: ${url} returned ${res?.status()} — pricing lives on the homepage per the notes`);
    } catch (e) { log(`- ⚠️ 00-pricing: ${e.message.split('\n')[0]}`); }
  }
  try { await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' }); }
  catch (e) {
    log(`- ❌ 00-home — ${e.message.split('\n')[0]}. Nothing captured: the site is unreachable from this network.`);
    screens = [];
  }
}

for (const screen of screens) {
  const id = screen.id;
  try {
    await h.screenshot(`${id}__arrival`, { fullPage: false }); // catches transient states (AI "thinking", cookie banner)
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await h.screenshot(id);
    writeFileSync(`${dirs.dom}${id}${suffix}.html`, await page.content());
    const css = await collectCss(page);
    writeFileSync(`${dirs.dom}${id}${suffix}.css`, css);
    recordMedia(css, id);
    const roles = await page.evaluate(probe, { specs: [...COMMON_ROLES, ...(screen.roles ?? []), ...(screen.before ?? [])], PROPS });
    roles.histogram = await page.evaluate(histogram);
    writeFileSync(`${dirs.styles}${id}${suffix}.json`, JSON.stringify({ screen: id, note: screen.note, url: page.url(), viewport: { w: vw, h: vh }, capturedAt: new Date().toISOString(), roles }, null, 2));
    const missing = Object.entries(roles).filter(([, v]) => v === null).map(([k]) => k);
    await screen.act(page, h);
    if (screen.expectUrl) await page.waitForURL(screen.expectUrl, { timeout: screen.expectTimeout ?? 20000 });
    log(`- ✅ ${id} — ${page.url()}${missing.length ? ` (roles not found: ${missing.join(', ')})` : ''}`);
  } catch (e) {
    await h.screenshot(`${id}__FAILED`).catch(() => {});
    log(`- ❌ ${id} — ${e.message.split('\n')[0]}. Stopped here; later screens not captured. See screenshots/${id}__FAILED${suffix}.png`);
    break;
  }
}

writeFileSync(mediaPath, JSON.stringify(media, null, 2));
await browser.close();
