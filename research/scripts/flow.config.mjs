// Screen-by-screen script for the tailored-onboarding flow, in the order documented in
// onboarding-flow-notes.md. Uses the same mock business every run so captures are reproducible.
//
// Selectors are text/role based on purpose: no DOM from the live site was available when this
// was written, so nothing here assumes Tailor Brands' class names. If a step can't find its
// target, capture.mjs saves a __FAILED screenshot, logs it, and stops (it never guesses).

export const MOCK = {
  businessName: 'Swell & Salt Surf Co.',
  state: 'California',
  activity: 'Surf shop selling surfboards, wetsuits and surf lessons',
};

// Chips on the tailored-onboarding screens are <button aria-pressed> wrapped in decorative spans
// (observed 1 Oct 2026: class funnel-suggestion-chips_*).
export const CHIP_SELECTORS = ['button[aria-pressed][class*=suggestion-chip]', 'button[aria-pressed]', '[role=checkbox]', '[role=radio]'];

export const HOME_URL = 'https://www.tailorbrands.com/';
export const PRICING_URLS = ['https://www.tailorbrands.com/pricing'];

// Generic role probes, applied on every screen. `text` is a case-insensitive regex source.
export const COMMON_ROLES = [
  { role: 'page', selectors: ['body'] },
  { role: 'h1', selectors: ['h1'] },
  { role: 'h2', selectors: ['h2'] },
  { role: 'h3', selectors: ['h3'] },
  { role: 'body', selectors: ['main p', 'p'] },
  // Enabled only: question screens are measured before they're answered, while Next is disabled.
  { role: 'primaryButton', selectors: ['button:not([disabled]):not([aria-disabled=true])', 'a[role=button]', 'a'], text: '^(next|start|continue|accept & close|get started)$' },
  { role: 'primaryButtonDisabled', selectors: ['button[disabled]', 'button[aria-disabled=true]'], text: '^(next|continue)$' },
  { role: 'secondaryButton', selectors: ['button', 'a'], text: '^(skip|remove|back|decline all)$' },
  // climbToBox: the visible border often lives on a wrapper, not on the <input> itself.
  { role: 'input', selectors: ['input[type=text]', 'input:not([type=hidden]):not([type=checkbox]):not([type=radio])', 'textarea'], climbToBox: true },
  { role: 'stepCounter', selectors: ['*'], text: '^\\s*\\d{1,2}\\s*/\\s*\\d{1,2}\\s*$', leaf: true },
  // The content column (observed 1 Oct 2026: intake-ai-body / analysis-progress / upsell content,
  // max-width 36rem = 576px). Only elements with a fixed px max-width count.
  // The 768px outer container (upsell-content-inner) holds a 576px column on every screen; prefer
  // that inner column, fall back to the container.
  { role: 'content', selectors: ['[class*=intake-ai-body]', '[class*=analysis-progress]', '[class*=upsell-content-inner] *', '[class*=upsell-content-inner]', '[class*=upsell-content]'], styleMatch: { prop: 'maxWidth', re: '^[0-9.]+px$' } },
];

// Per-screen steps. `roles` add screen-specific probes; `before`/`after` roles are captured
// around the `act` interaction (e.g. disabled Next before choosing a state).
export const SCREENS = [
  {
    id: '00-home',
    note: 'Homepage: business name input + Start. Cookie banner captured, then declined.',
    roles: [
      { role: 'cookieBanner', selectors: ['div', 'section'], text: 'decline all', climbToBox: true },
      { role: 'pricingCard', selectors: ['div', 'section', 'article'], text: '^\\s*essential', climbToBox: true },
      // "POPULAR": white text (badgeText) on a gradient strip (badge). Recorded separately because the
      // strip's colour is a background-image, not a background-color.
      { role: 'badgeText', selectors: ['*'], text: '^popular$', leaf: true },
      { role: 'badge', selectors: ['*'], text: '^popular$', leaf: true, climbToBox: true },
    ],
    act: async (page, h) => {
      await h.clickText(/^decline all$/i, { optional: true });
      await h.fillFirstInput(MOCK.businessName);
      await h.clickText(/^start$/i);
    },
    // As of 1 Oct 2026 the homepage sends new visitors to the "business guide" flow instead;
    // capture.mjs detects which one it landed in (see BUSINESS_GUIDE below).
    expectUrl: /tailored-onboarding\/.+\/intro|boarding\/business-guide\/\d+/,
    expectTimeout: 60000,
  },
  {
    id: '01-intro',
    note: '"Before we begin" — first-person AI persona intro.',
    act: async (page, h) => h.clickText(/^next$/i),
    expectUrl: /business-state/,
  },
  {
    id: '02-business-state',
    note: '1/6 autocomplete. Next is disabled until a state is chosen (observed state).',
    before: [{ role: 'primaryButtonDisabled', selectors: ['button[disabled]', 'button[aria-disabled=true]'] }],
    act: async (page, h) => {
      await h.fillFirstInput(MOCK.state);
      await h.screenshot('02-business-state__autocomplete-open');
      await h.captureRoles('02-business-state__autocomplete-open', [
        { role: 'autocompleteMenu', selectors: ['[role=listbox]', 'ul'] },
        { role: 'autocompleteOption', selectors: ['[role=option]', 'li'], text: '^california$' },
      ]);
      await h.clickText(/^california$/i);
      await h.clickText(/^next$/i);
    },
    expectUrl: /business-activity/,
  },
  {
    id: '03-business-activity',
    note: '2/6 free text ("Plain English — a few words is plenty").',
    roles: [{ role: 'helper', selectors: ['*'], text: 'plain english', leaf: true }],
    act: async (page, h) => {
      await h.fillFirstInput(MOCK.activity);
      await h.clickText(/^next$/i);
    },
    expectUrl: /about-your-business-1/,
  },
  {
    id: '04-about-your-business-1',
    note: '3/6 owner chips (AI-personalised per visit). Watch for the "Swell Salt" name bug.',
    roles: [{ role: 'chip', selectors: CHIP_SELECTORS }],
    act: async (page, h) => {
      await h.clickFirstChip();
      await page.waitForTimeout(600);
      await h.captureRoles('04-about-your-business-1__chip-selected', [
        { role: 'chipSelected', selectors: ['[aria-pressed=true]', '[aria-checked=true]', '[class*=selected]', 'label:has(input:checked)'] },
      ]);
      await h.screenshot('04-about-your-business-1__chip-selected');
      await h.clickText(/^next$/i);
    },
    expectUrl: /about-your-business-2/,
  },
  {
    // Options are AI-generated per visit (the notes recorded "Local surfers", "Visiting surfers", …),
    // so pick the first two chips rather than matching labels.
    id: '05-about-your-business-2',
    note: '4/6 customer chips + free text.',
    roles: [{ role: 'chip', selectors: CHIP_SELECTORS }],
    act: async (page, h) => {
      await h.clickFirstChip(0);
      await h.clickFirstChip(1);
      await h.clickText(/^next$/i);
    },
    expectUrl: /about-your-business-3/,
  },
  {
    id: '06-about-your-business-3',
    note: '5/6 channel chips.',
    roles: [{ role: 'chip', selectors: CHIP_SELECTORS }],
    act: async (page, h) => {
      await h.clickFirstChip(0);
      await h.clickText(/^next$/i);
    },
    expectUrl: /business-expenses/,
  },
  {
    id: '07-business-expenses',
    note: '6/6 revenue bands (single select).',
    roles: [{ role: 'card', selectors: [...CHIP_SELECTORS, '[role=radio]'] }],
    act: async (page, h) => {
      const notYet = page.getByText(/^not yet$/i).first();
      if (await notYet.count()) await notYet.click({ timeout: 8000 }); else await h.clickFirstChip(0);
      await page.waitForTimeout(600);
      await h.captureRoles('07-business-expenses__selected', [
        { role: 'cardSelected', selectors: ['[aria-pressed=true]', '[aria-checked=true]', '[class*=selected]', 'label:has(input:checked)'] },
      ]);
      await h.clickText(/^next$/i, { optional: true });
    },
    expectUrl: /scanning|blueprint/,
  },
  {
    id: '08-scanning',
    note: 'Labor-illusion loader (~15s). Screenshots taken over time to record the rotating status text and %.',
    roles: [
      // Observed 1 Oct 2026: analysis-step_analysis-progress-{track,fill,pct}__*
      { role: 'loaderPercent', selectors: ['[class*=progress-pct]', '*'], text: '^\\s*\\d{1,3}\\s*%\\s*$', leaf: true },
      { role: 'loaderTrack', selectors: ['[class*=progress-track]', '[role=progressbar]'] },
      { role: 'loaderFill', selectors: ['[class*=progress-fill]', '[role=progressbar] > *'] },
    ],
    act: async (page, h) => {
      for (const t of [3, 6, 9, 12]) {
        await page.waitForTimeout(3000);
        await h.screenshot(`08-scanning__t${t}s`, { fullPage: false });
      }
    },
    expectUrl: /blueprint/,
    expectTimeout: 60000,
  },
  {
    id: '09-blueprint',
    note: '"Your business blueprint is almost ready." Part 1 / Part 2 lists.',
    act: async (page, h) => h.clickText(/^(next|continue|let'?s go|get started|start)$/i),
    expectUrl: /entity/,
  },
  {
    id: '10-entity',
    note: 'Section nav, dismissible promo banner, AI "thinking" state, FREE notifications add-on (we click Skip — never consent to SMS marketing with a mock identity).',
    roles: [
      { role: 'banner', selectors: ['*'], text: 'amazon gift card', climbToBox: true },
      { role: 'sectionNav', selectors: ['nav', 'ul', 'div'], text: 'entity.*liability.*branding', climbToBox: false },
      { role: 'card', selectors: ['*'], text: 'business updates', climbToBox: true },
      { role: 'badge', selectors: ['*'], text: 'free', leaf: true },
    ],
    act: async (page, h) => {
      await h.clickText(/^skip$/i, { optional: true });
      await h.clickText(/^next$/i);
    },
    expectUrl: /liability/,
  },
  {
    id: '11-liability',
    note: 'Personal Liability Suite, items pre-added. On 1 Oct 2026 items showed an "ADDED" tag rather than Remove buttons, and "What is it" was not visible until an item is opened.',
    roles: [
      { role: 'card', selectors: ['*'], text: '^annual report', leaf: true, climbToBox: true },
      { role: 'suiteHeading', selectors: ['*'], text: 'personal liability suite', leaf: true },
      { role: 'badge', selectors: ['*'], text: '^added$', leaf: true },
    ],
    act: async (page, h) => {
      // Hover state of the primary button (observed deliberately, then the mouse is moved away).
      const next = page.getByRole('button', { name: /^next$/i }).first();
      await next.hover().catch(() => {});
      await page.waitForTimeout(500);
      await h.captureRoles('11-liability__next-hover', [{ role: 'primaryButtonHover', selectors: ['button:hover'], text: '^next$' }]);
      await page.mouse.move(0, 0);
      // "What is it" if it's visible; otherwise open the first item to reveal its details.
      const whatIsIt = page.getByText(/what is it/i).filter({ visible: true }).first();
      if (await whatIsIt.count()) await whatIsIt.click({ timeout: 8000 });
      else await page.getByText(/^annual report$/i).first().click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await h.screenshot('11-liability__drawer-open');
      await h.captureRoles('11-liability__drawer-open', [
        { role: 'drawer', selectors: ['[role=dialog]', 'aside', '[class*=drawer]', '[class*=sheet]', '[class*=expand]', '[aria-expanded=true]'] },
      ]);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      await h.clickText(/^next$/i);
    },
    expectUrl: /branding/,
  },
  {
    id: '12-branding',
    note: 'Branding Suite — Website + Domain pre-added.',
    roles: [{ role: 'card', selectors: ['*'], text: '^website', leaf: true, climbToBox: true }],
    act: async (page, h) => h.clickText(/^next$/i),
    expectUrl: /registration/,
  },
  {
    id: '13-registration',
    note: 'Launch-plan timeline blurred behind the registration modal. Not submitted (would need a real phone/email).',
    roles: [
      { role: 'modal', selectors: ['[role=dialog]', '[aria-modal=true]', '[class*=modal]'] },
      { role: 'modalBackdrop', selectors: ['[class*=overlay]', '[class*=backdrop]'] },
      { role: 'blurredContent', selectors: ['[style*=blur]', '[class*=blur]'] },
      { role: 'tab', selectors: ['[role=tab]', 'button', '*'], text: '^this week$', leaf: true },
      { role: 'googleButton', selectors: ['button', 'a', 'div[role=button]'], text: 'google' },
      { role: 'select', selectors: ['select', '[role=combobox]'] },
    ],
    // The plan animates in first; the registration modal appears afterwards. Wait for it, then
    // capture the modal state separately. Nothing is typed or submitted.
    act: async (page, h) => {
      const modal = page.locator('[role=dialog], [aria-modal=true], input[type=password], input[type=email]').filter({ visible: true }).first();
      await modal.waitFor({ timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await h.screenshot('13-registration__modal');
      await h.captureRoles('13-registration__modal', [
        { role: 'modal', selectors: ['[role=dialog]', '[aria-modal=true]', '[class*=modal]', '[class*=Modal]', 'form:has(input[type=password])'], climbToBox: true },
        { role: 'modalBackdrop', selectors: ['[class*=overlay]', '[class*=backdrop]', '[class*=Overlay]', '[class*=Backdrop]'] },
        { role: 'blurredContent', selectors: ['main *', 'body *'], styleMatch: { prop: 'filter', re: 'blur' } },
        { role: 'input', selectors: ['input[type=email]', 'input[type=text]', 'input[type=tel]'], climbToBox: true },
        { role: 'primaryButton', selectors: ['button[type=submit]', 'button'], text: '^(continue|sign up|register)$' },
        { role: 'googleButton', selectors: ['button', 'a', 'div[role=button]'], text: 'google' },
        { role: 'select', selectors: ['select', '[role=combobox]'] },
        { role: 'h2', selectors: ['[role=dialog] h1', '[role=dialog] h2', 'h2'] },
        { role: 'tab', selectors: ['[role=tab]', 'button', '*'], text: '^this week$', leaf: true },
      ]);
    },
  },
];

// ---------------------------------------------------------------------------------------------
// "Business guide" flow (studio.tailorbrands.com/boarding/business-guide/<id>/<step>).
// Observed 1 Oct 2026: the homepage now routes every new visitor here, and the tailored-onboarding
// URLs above redirect to the studio home. This flow is a generic questionnaire (X/10), so it is
// walked by capture.mjs's business-guide walker rather than a fixed per-screen script.
// Selectors below come from inspecting the live DOM on 1 Oct 2026 (Ember app, Tailwind classes,
// data-testing-id attributes).
export const BUSINESS_GUIDE = {
  urlPattern: /boarding\/business-guide\/\d+/,
  maxSteps: 30,
  // Overrides COMMON_ROLES entries with the same role name.
  roles: [
    { role: 'h1', selectors: ['[class*=font-gazpacho]', 'h1'] },
    { role: 'helper', selectors: ['[class*=text-text-secondary]'] },
    { role: 'body', selectors: ['main'] },
    { role: 'primaryButton', selectors: ['.tailor-primary-btn:not([disabled])'] },
    { role: 'primaryButtonDisabled', selectors: ['.tailor-primary-btn[disabled]', '.tailor-primary-btn:disabled'] },
    { role: 'secondaryButton', selectors: ['.tailor-secondary-btn'] },
    { role: 'chip', selectors: ['[role=button][data-testing-id^=segmentation_]', '[role=button][data-testing-id]'] },
    { role: 'card', selectors: ['[role=button][data-testing-id^=segmentation_]', '[role=button][data-testing-id]'] },
    { role: 'input', selectors: ['input[type=text]', 'textarea'], climbToBox: true },
    { role: 'loaderFill', selectors: ['.cp-global-header-progress-bar'] },
    { role: 'loaderTrack', selectors: [':has(> .cp-global-header-progress-bar)'] },
    { role: 'pageBackground', selectors: ['main *', 'main', 'body *'], styleMatch: { prop: 'backgroundImage', re: 'gradient' } },
    // The question column (e.g. md:max-w-148 = 37rem), not the outer page container.
    { role: 'content', selectors: ['[class*="md:max-w-"][class*="mx-auto"]', 'main'] },
    { role: 'modal', selectors: ['[role=dialog]', '[aria-modal=true]', '[class*=modal]'] },
    { role: 'modalBackdrop', selectors: ['[class*=overlay]', '[class*=backdrop]'] },
  ],
  mock: {
    state: 'California',
    text: 'Surf shop selling surfboards, wetsuits and surf lessons',
  },
};
