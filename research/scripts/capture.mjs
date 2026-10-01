// Walks the Tailor Brands onboarding flow with Playwright and records, per screen:
//   reference/screenshots/<id>.png       full-page screenshot (+ arrival / interaction shots)
//   reference/dom/<id>.html, <id>.css    raw DOM + every stylesheet the page loaded
//   reference/styles/<id>.json           getComputedStyle() for each UI role + page-wide histogram
//   reference/styles/_media.json         every @media condition seen (breakpoint evidence)
//   reference/CAPTURE_LOG.md             what ran, what failed, and why
//
// Usage:
//   npm run research:capture                                  # full run from the homepage
//   npm run research:capture -- --start-url <onboarding url>  # resume inside an existing session
//   npm run research:capture -- --viewport 390x844            # mobile pass (files suffixed @390)
//   npm run research:capture -- --headed                      # watch it / step in manually
import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { COMMON_ROLES, SCREENS, HOME_URL, PRICING_URLS, BUSINESS_GUIDE, CHIP_SELECTORS } from './flow.config.mjs';
import { X509Certificate, createHash } from 'node:crypto';
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
// Behind a TLS-intercepting proxy (e.g. a sandbox egress proxy), Chromium must trust that proxy's
// CA. Trust exactly that one key (SPKI pin) rather than disabling certificate checks.
// Set CAPTURE_PROXY_CA=<pem path>, or it is auto-detected in the Claude Code cloud sandbox.
function proxyCaArgs() {
  const caPath = process.env.CAPTURE_PROXY_CA ?? '/root/.ccr/agent-proxy-ca.crt';
  if (!existsSync(caPath)) return [];
  const spki = new X509Certificate(readFileSync(caPath)).publicKey.export({ type: 'spki', format: 'der' });
  return [`--ignore-certificate-errors-spki-list=${createHash('sha256').update(spki).digest('base64')}`];
}

async function launch() {
  const args = proxyCaArgs();
  try { return await chromium.launch({ headless: !headed, args }); }
  catch (e) {
    const fallback = '/opt/pw-browsers/chromium';
    if (!existsSync(fallback)) throw e;
    return chromium.launch({ headless: !headed, executablePath: fallback, args });
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
  async clickFirstChip(index = 0) {
    // Prefer real toggle buttons; fall back to the visual heuristic for unknown markup.
    for (const sel of CHIP_SELECTORS) {
      const chips = page.locator(sel).filter({ visible: true });
      if ((await chips.count()) > index) { await chips.nth(index).click({ timeout: 8000 }); await page.waitForTimeout(400); return; }
    }
    const roles = await page.evaluate(probe, { specs: [{ role: 'chip', selectors: ['label', 'button'], chip: true }], PROPS });
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
        await h.captureRoles('00-pricing', [...COMMON_ROLES, { role: 'pricingCard', selectors: ['div', 'section', 'article'], text: '^\\s*essential', climbToBox: true }, { role: 'badgeText', selectors: ['*'], text: '^popular$', leaf: true }, { role: 'badge', selectors: ['*'], text: '^popular$', leaf: true, climbToBox: true }]);
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
    await page.mouse.move(0, 0); // never measure a hover state left over from the previous click
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
    if (BUSINESS_GUIDE.urlPattern.test(page.url())) {
      log('- ↪ Homepage routed to the "business guide" flow (not tailored-onboarding). Switching to the business-guide walker.');
      await runBusinessGuide();
      break;
    }
  } catch (e) {
    await h.screenshot(`${id}__FAILED`).catch(() => {});
    log(`- ❌ ${id} — ${e.message.split('\n')[0]}. Stopped here; later screens not captured. See screenshots/${id}__FAILED${suffix}.png`);
    break;
  }
}

// ---------- business-guide walker ----------
// Generic questionnaire walk: capture the step, answer it with a neutral choice (first option under
// each question, or the mock text/state), press the primary CTA, wait for the next step. Stops at a
// sign-up/payment gate (captured, never submitted), on leaving the flow, or when nothing changes.
async function runBusinessGuide() {
  const roleSpecs = [...COMMON_ROLES.filter((c) => !BUSINESS_GUIDE.roles.some((b) => b.role === c.role)), ...BUSINESS_GUIDE.roles];
  // Snapshot of "which question is showing". A navigation mid-read throws; treat that as movement.
  const signature = () => page.evaluate(() => location.pathname + '|' + [...document.querySelectorAll('[class*=font-gazpacho], h1, h2')].map((e) => e.innerText).join('|').slice(0, 300))
    .catch(() => `navigating:${Date.now()}`);
  let selectedCaptured = false;
  let stalls = 0;
  for (let n = 1; n <= BUSINESS_GUIDE.maxSteps; n++) {
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const url = page.url();
    const seg = new URL(url).pathname.split('/').filter(Boolean).pop();
    const id = `bg-${String(n).padStart(2, '0')}-${seg}`;
    try {
      if (!BUSINESS_GUIDE.urlPattern.test(url)) {
        // Error pages and exits are evidence for the log, not design: screenshot only, no styles.
        await h.screenshot(`${id}__exit`);
        log(`- ⏹ left the business-guide flow at ${url} — screenshot ${id}__exit${suffix}.png, not measured. Stopping.`);
        return;
      }
      await h.screenshot(id);
      writeFileSync(`${dirs.dom}${id}${suffix}.html`, await page.content());
      const css = await collectCss(page);
      writeFileSync(`${dirs.dom}${id}${suffix}.css`, css);
      recordMedia(css, id);
      const roles = await page.evaluate(probe, { specs: roleSpecs, PROPS });
      roles.histogram = await page.evaluate(histogram);
      const heading = roles.h1?.text ?? '';
      writeFileSync(`${dirs.styles}${id}${suffix}.json`, JSON.stringify({ screen: id, flow: 'business-guide', heading, url, viewport: { w: vw, h: vh }, capturedAt: new Date().toISOString(), roles }, null, 2));

      const hasPassword = await page.locator('input[type=password]').filter({ visible: true }).count();
      if (hasPassword || /checkout|payment|billing/i.test(url)) {
        log(`- ✅ ${id} — "${heading}" — sign-up/payment gate reached; captured, not submitted. Stopping.`);
        return;
      }

      const before = await signature();
      // 1) choose the first option under each question on the page
      const picks = await page.evaluate(() => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        document.querySelectorAll('[data-tb-pick]').forEach((e) => e.removeAttribute('data-tb-pick'));
        const heads = [...document.querySelectorAll('[class*=font-gazpacho]')].filter(vis);
        const cards = [...document.querySelectorAll('[role=button][data-testing-id]')].filter(vis);
        const chosen = [];
        if (!heads.length && cards[0]) chosen.push(cards[0]);
        heads.forEach((hd, i) => {
          const next = heads[i + 1];
          const c = cards.find((c) => (hd.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) && (!next || (next.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING)));
          if (c && !chosen.includes(c)) chosen.push(c);
        });
        chosen.forEach((c, i) => c.setAttribute('data-tb-pick', String(i)));
        return chosen.map((c) => (c.innerText || '').trim().split('\n')[0]);
      }).catch(() => []);
      for (let i = 0; i < picks.length; i++) {
        await page.locator(`[data-tb-pick="${i}"]`).click({ timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(700);
        if ((await signature()) !== before) break; // single-select questions may auto-advance
        if (!selectedCaptured) {
          await h.captureRoles(`${id}__selected`, [
            { role: 'chipSelected', selectors: [`[data-tb-pick="${i}"]`] },
            { role: 'cardSelected', selectors: [`[data-tb-pick="${i}"]`] },
          ]);
          await h.screenshot(`${id}__selected`, { fullPage: false });
          selectedCaptured = true;
        }
      }
      // 2) no options: answer text / state inputs
      if (!picks.length && (await signature()) === before) {
        const input = page.locator('input[type=text], input:not([type]), textarea').filter({ visible: true }).first();
        if (await input.count() && !(await input.inputValue())) {
          const pageText = (await page.locator('main').innerText().catch(() => '')).toLowerCase();
          const isState = /\bstate\b|based|located/.test(pageText);
          await input.click();
          await input.pressSequentially(isState ? BUSINESS_GUIDE.mock.state : BUSINESS_GUIDE.mock.text, { delay: 30 });
          await page.waitForTimeout(1200);
          if (isState) await page.getByText(new RegExp(`^${BUSINESS_GUIDE.mock.state}$`)).first().click({ timeout: 5000 }).catch(() => {});
        }
      }
      // 3) press the primary CTA (or Skip), unless the page already moved on
      if ((await signature()) === before) {
        const primary = page.locator('.tailor-primary-btn:not([disabled])').filter({ visible: true }).first();
        const named = page.getByRole('button', { name: /^(next|continue|let'?s go|get started|show me|see (my|your) .*)$/i }).filter({ visible: true }).first();
        const skip = page.locator('.tailor-secondary-btn').filter({ visible: true }).first();
        const target = (await primary.count()) ? primary : (await named.count()) ? named : skip;
        if (await target.count()) await target.click({ timeout: 8000 }).catch(() => {});
      }
      // 4) wait for the next step (loaders can take a while)
      let moved = false;
      for (let t = 0; t < 60 && !moved; t++) { await page.waitForTimeout(500); moved = (await signature()) !== before; }
      log(`- ✅ ${id} — "${heading}"${picks.length ? ` — chose: ${picks.join(' / ')}` : ''}${moved ? '' : ' — (no change after 30s)'}`);
      if (!moved && ++stalls >= 2) { log(`- ⏹ stopped at ${id}: the page did not advance twice in a row. See screenshots/${id}${suffix}.png`); return; }
      if (moved) stalls = 0;
    } catch (e) {
      await h.screenshot(`${id}__FAILED`).catch(() => {});
      log(`- ❌ ${id} — ${e.message.split('\n')[0]}. Stopped here. See screenshots/${id}__FAILED${suffix}.png`);
      return;
    }
  }
  log(`- ⏹ reached the ${BUSINESS_GUIDE.maxSteps}-step limit.`);
}

writeFileSync(mediaPath, JSON.stringify(media, null, 2));
await browser.close();
