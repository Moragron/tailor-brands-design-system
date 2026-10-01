# Research: how the design system was measured

> **This folder is not part of the design system.** The design system (`src/`, `tokens/`) is content-free and is what Lovable copies into connected projects. This folder is the evidence and analysis behind it, kept for the Growth PM take-home: how every token was measured from tailorbrands.com, plus findings about the onboarding flow. Nothing here ships in the package or in the published Storybook. You can delete the folder without affecting the design system; the only loss is the ability to re-measure tokens.

**Source:** the Tailor Brands tailored-onboarding flow (`studio.tailorbrands.com/tailored-onboarding/…`). The walkthrough notes are in [`reference/onboarding-flow-notes.md`](reference/onboarding-flow-notes.md) (26 Sep 2026, desktop, mock business "Swell & Salt Surf Co.", a CA surf shop). The live capture of all 14 screens is from 1 Oct 2026, homepage through registration overlay, with nothing submitted.

**Result:** 67 of 72 tokens measured (`"$observed": true` in `../tokens/tokens.json`, each with a `$source` into `reference/styles/`). 5 have no counterpart in the flow and stay neutral placeholders: muted surface, solid badge background, error colour, `h3` and page gradient. Full audit: [`reference/styles/_derivation.md`](reference/styles/_derivation.md).

## What's here

| Path | What |
|---|---|
| `reference/` | Raw evidence: notes, screenshots, DOM + CSS snapshots, computed styles per UI role, capture log, derivation audit |
| `scripts/capture.mjs` + `flow.config.mjs` + `probe.mjs` | Playwright walk of the homepage, pricing page and flow → screenshots, DOM/CSS, `getComputedStyle()` per UI role |
| `scripts/derive-tokens.mjs` | Captures + `../tokens/tokens.base.json` (rules) → `../tokens/tokens.json` → `../src/styles/tokens.css` (and the other generated style files), plus `reference/styles/_derivation.md` |
| `scripts/visual-qa.mjs` | Renders the prototype screens next to their captures, pixel-diffs them → `qa-report/index.html` |
| `scripts/selftest-pipeline.mjs` | Offline proof that capture → derive round-trips tokens (runs in CI) |
| `prototype/` | The observed flow rebuilt from the public design-system API, with all flow copy kept here, never in the package. Includes `RegistrationModal`, the only flow-specific component. |
| `.storybook/` | Research Storybook: `npm run research:storybook` (port 6007) |
| `component-inventory.md` | Which components and states were observed on which screen |

## Commands

```bash
npm run research:capture          # walk the live site (needs network access to tailorbrands.com and its hosts)
npm run research:tokens           # captures → ../tokens/tokens.json/.css + _derivation.md
npm run research:build-storybook  # build the prototype Storybook
npm run research:qa               # side-by-side + pixel diff → qa-report/index.html
npm run research:selftest         # pipeline round-trip check (needs research:build-storybook first)
```

## Methodology

**1. Flow and content come from the notes; the visual layer comes from the computed styles.** The notes are the source of truth for screen order, copy, option lists and defects. Every string in the components and screens is either quoted from the notes or marked `[copy not captured]`. Nothing is filled in with plausible-sounding copy.

**2. Capture by *role*, not by class name.** Without their source, I couldn't rely on Tailor Brands' class names, so `flow.config.mjs` describes each UI role by what's visible: the primary button is the button whose text is Next/Start/Continue; a chip is a short-text, boxed element with at least 3 siblings; the banner is the nearest boxed ancestor of "Amazon gift card". For each role, `probe.mjs` records 32 computed properties, the element's bounding box, and a CSS path. It also records a page-wide histogram of colours, sizes, radii and spacing.

Roles that need interaction are captured around the interaction:
- `primaryButtonDisabled` before a state is chosen
- `chipSelected` after clicking a chip
- `drawer` after "What is it"
- the autocomplete menu while open
- the scanning loader at 3/6/9/12 s
- an `__arrival` screenshot before network idle, to catch the transient AI "Thinking" state

The walk uses the same mock business every run. It clicks **Skip** on the SMS-consent card and **never submits** the registration form, because both would need a real identity. Neither is fabricated.

**3. Tokens are resolved by declared rule, with evidence.** Each token names its rule (e.g. `color.action.primary-bg ← primaryButton.backgroundColor`).
- `derive-tokens` takes the most common value across the **onboarding** screens and falls back to homepage/pricing only when a role never appears in the flow (the brief says the flow wins).
- It records how many captures agree and lists conflicting values in `_derivation.md`, so any value can be traced back to a screenshot and element.
- It infers the spacing base as 8 px if ≥80 % of observed spacing values divide by 8, else 4 px if ≥80 % divide by 4, else UNKNOWN.
- It takes breakpoints from the most frequent `min-/max-width` values in the captured stylesheets' `@media` rules.
- Any token whose rule matches nothing keeps its placeholder and stays `$observed: false`.

**4. Components are built against tokens only.** Component CSS references `var(--tb-*)` and never literals, so a capture restyles the whole library without code changes. States that weren't observed are left unstyled, with an `UNKNOWN` comment in the CSS, rather than given a guessed design.

**5. Visual QA.** `npm run research:qa` renders every story at 1440×900 and screenshots just the story. It pairs the story with its reference: screen stories compare against the full screenshot, and component stories with a `role` compare against the reference **cropped to that element's captured bounding box**. It runs `pixelmatch` and flags anything where more than 15 % of pixels differ. The score is a coarse filter for big deltas, not a pass/fail: AI-personalised copy will always differ.

## Verification

Done in the build environment:

- `npm run typecheck`: clean.
- `npm run research:build-storybook`: builds the prototype Storybook (14 flow screens + variants).
- **Package in a real app (0.2.0, before the move to Lovable):** `examples/next-app` (Next.js 16 + Tailwind 4) installs the packed package and builds with both routes prerendered. In the browser, component styles survive Tailwind preflight, `text-tb-*` / `bg-tb-*` utilities resolve to the tokens, and there are no hydration errors. Every Tailwind token utility listed in `AGENTS.md` was compiled and checked.
- **Click-through test:** Playwright drove the full prototype from homepage to registration. It confirmed:
  - Next is disabled until a state is chosen
  - chips toggle `aria-checked`
  - scanning auto-advances
  - the banner dismisses
  - the 3 liability items start pre-added (Remove) and flip to Add
  - the drawer expands
  - the gate shows the observed "Sign up"/"Continue" mismatch
  - no runtime errors
- **`npm run research:selftest`:** runs the *real* capture probe against the built Storybook screens, runs `derive-tokens` on the output (in a temp dir), and asserts that the tokens come back out unchanged. **14/14 pass.** On its first run it caught two bugs that would have produced wrong tokens from the live site: the input border lived on a wrapper, not on the `<input>`, and a broad text match returned `<html>` instead of the banner. Both are fixed in the probe.
- **`npm run research:capture`:** walks all 14 screens and logs every run to `reference/CAPTURE_LOG.md`. When the site is unreachable, it exits cleanly without writing fake captures.

## Assumptions

| Assumption | Why | How it gets checked |
|---|---|---|
| Revenue bands are **cards** (`SelectionCardGroup`), not chips | The brief lists a "radio/selection card"; the notes don't say | QA against `07-business-expenses.png`; swap to `ChipGroup mode="single"` if needed |
| "What is it" expands **inline** | The notes say "drawer" without saying inline or side sheet | `11-liability__drawer-open.png` |
| Registration gate has **no close control** by default | A hard gate matches "Register to access…"; unconfirmed | `Modal onClose` prop exists; the reference decides |
| Focus rings on all interactive elements | Accessibility baseline. **Not observed**, and marked as ours in CSS | — |
| Section nav marks the active step with an underline | Only "progress nav" was recorded | `sectionNav` capture role |
| `buggyShortName()` reproduces the name bug's **output**, not its cause | The notes record only the output | — |
| Plain-text "Tailor Brands" wordmark | Logo asset not captured; avoids copying a trademark file | — |

## Known gaps

1. **5 of 72 tokens are still placeholders**, because the flow has no element for them:
   - muted surface
   - solid badge background (the "*FREE"/"ADDED" tags have transparent backgrounds; the homepage "POPULAR" strip is a gradient, recorded as `effect.badge-gradient`)
   - error colour (no validation error was triggered)
   - `h3`
   - page gradient (the flow uses a faint radial glow and a state-seal illustration, not a gradient)

   `reference/styles/_derivation.md` lists every token with its source, the number of captures that agree, and conflicting values.
2. **Fonts are licensed, so they're referenced, not shipped.** Tailor Brands uses **Proxima Nova** (body) and **Memories** (headings, in the flow; marketing pages also use Gazpacho), and none of them are bundled. Tokens carry a not-observed `$fallback` (Helvetica/Arial; Georgia), so apps without the licence still render sensibly. Load the real fonts in an app that has the licence.
3. **The live flow has evolved since the notes (26 Sep → 1 Oct).** The screen order and the patterns are the same, but:
   - screen 3 now asks "Who actually does the work day-to-day?" (options such as "Just me", "Me + family helping")
   - Liability and Branding items show an "ADDED" tag instead of Remove buttons
   - the registration modal is a full-page translucent overlay (white at 85%, 12px backdrop blur), not a card

   Components and screen stories still follow the notes; the captures show today's version.
4. **States never observed**: hover, active, focus, error/validation, loading, and empty/no-results, for every component. See the per-component list in the [inventory](component-inventory.md).
5. **Mobile.** The notes are desktop-only. Breakpoints get inferred from `@media` rules, but mobile *behaviour* needs `npm run research:capture -- --viewport 390x844`.
6. **Copy not recorded:**
   - screen 4's AI-generated owner chips
   - the intermediate revenue bands
   - the "What is it" section bodies
   - the rest of the branding domain paragraph
   - the plan date line
   - Quarterly/Yearly tab content (only reachable after registering)
   - the full legal line
   - the SSO button label
7. **Post-registration screens**: not reachable without a real phone number and email. Deliberately not attempted.
8. **Personalisation is non-deterministic.** Copy on screens 4–5 and 10–12 is AI-generated per session. Captures across runs will differ in text, but not in style.

## Finishing the capture

`npm run research:capture` detects which flow the homepage routes to. It runs the scripted notes flow if that comes back, and otherwise the generic **business-guide walker**. The walker captures each step, answers it with the first option under each question (or the mock text/state), and stops at any sign-up or payment gate without submitting. `npm run research:tokens` always rebuilds `../tokens/tokens.json` from the baseline `../tokens/tokens.base.json`, so a re-run never keeps a stale value.

The capturing machine needs to reach every host the site uses. On a normal computer that's automatic. In the Claude Code cloud environment, allow these in its network settings (or choose a broader access level):

`tailorbrands.com`, `www.tailorbrands.com`, `studio.tailorbrands.com`, `sauron.tailorbrands.com`, `statsigapi.net`, `featureassets.org`, `www.google.com`, `cloudflare-dns.com`

Without `statsigapi.net` / `featureassets.org`, the site can't load its experiment assignment and routes visitors to a different onboarding (a 10-step "business guide"). The capture then falls back to its business-guide walker, which measures the wrong flow.

Then:

```bash
npx playwright install chromium   # first time only (not needed in the cloud environment)
npm run research:capture
npm run research:tokens                    # ../tokens/tokens.json/.css + reference/styles/_derivation.md
npm run research:build-storybook && npm run research:qa   # open qa-report/index.html, review flagged rows
```

Behind a TLS-intercepting proxy (like the cloud environment's), the capture tells Chromium to trust exactly that proxy's CA key (`CAPTURE_PROXY_CA`, auto-detected); it never disables certificate checks. If a step can't proceed, the capture saves a screenshot, logs it to `reference/CAPTURE_LOG.md`, and stops; it doesn't guess. `--headed` lets you watch.

## Growth notes

*Component names below refer to the prototype at the time of writing: `SuiteItem` is now the generic `AddOnItem`, and `RegistrationModal` lives in `prototype/components/`.*

The design system choices below are aimed at the friction points already flagged in the notes. Each maps to a component API and a test that can be run.

### 1. Pre-added, opt-out add-ons (Liability + Branding suites, screens 11–12)

**Observed:** Annual Report, EIN, Operating Agreement, Website and Domain all start **added**, with Remove buttons and **no prices shown**. On screen 10, "Business Updates & Notification *FREE" is presented as a free feature. Tapping Add is actually consent to SMS/call marketing (TCPA, up to 15 msgs/mo), and the copy refers to "the mobile number you have provided" before any phone number has been collected.

**Design-system decisions:**
- **`SuiteItem.added` is a required, controlled prop with no default.** Pre-adding stays possible, but each screen has to set it explicitly, so it becomes a visible decision in code review rather than a component default.
- **`price` exists on `SuiteItem`** even though the live site shows none. Hiding the price of pre-selected paid items moves the surprise to checkout, where it shows up as cart abandonment, refunds and chargebacks instead of as an informed choice.
- **`mode="choice"` (Skip / Add) is kept visually separate from `toggle`.** The recommendation is to go further: consent shouldn't be a `SuiteItem` at all. A dedicated consent pattern (unchecked checkbox, legal copy slot, asked only after the phone field) protects list quality and TCPA exposure.
- **Test ready to run:** `OnboardingFlow preAddSuites={false}` (story *S11 Liability — opt-in variant*). Primary metric: paid-plan checkout completion. Guardrails: add-on revenue per visitor, 30-day refund/chargeback rate, support contacts mentioning "didn't order".

### 2. Blurred report behind the registration modal (screen 13)

**Observed:** After 12 screens, a ~15 s "labor illusion" scan and a personalised blueprint, the Custom Launch Plan is shown **blurred** behind "Register to access your business report for free." The form asks for name, **phone**, email, password and an attribution question, and agrees the user to marketing email.

**Design-system decisions:**
- **`GatedContent` makes the gate a reusable, parameterised pattern** (`locked`, `gate`) rather than a one-off. The prototype can then test gate *position and depth*, not just copy. For example:
  - unblur the "This week" tab and gate only Quarterly/Yearly ("register to save your plan")
  - gate with SSO + email only, and collect phone later in context
- **`TimelineTabs` is independent of the gate**, so partial reveal needs no new component.
- The sunk cost at this point is high, so the gate converts, but it's also where "bait" perception peaks. **Test:** partial-reveal + SSO/email-only vs. current. Primary metric: registration rate. Guardrails: downstream LLC submission (activation), and the phone-number share if phone moves later.

### 3. "Sign up" copy vs "Continue" button (screen 13)

**Observed:** The legal line reads 'By clicking "Sign up"…' while the button says **Continue**.

**Design-system decision:** `RegistrationModal` **derives the legal line from `ctaLabel`** by default. A mismatch now has to be set explicitly (`legalCtaLabel`), and only the *As observed* story does so. Rule for the system: *consent copy that names a control must read the label from that control.* This matters beyond polish, because whether a clickwrap agreement holds up can depend on the named button matching the one actually clicked. See the stories *RegistrationModal / As observed* vs *Fixed*.

### Also worth raising
- **Name truncation** ("Swell Salt" for "Swell & Salt Surf Co.", screens 4–5). The flow's pitch is "I know your business", and it gets the business name wrong on the first personalised screen. `displayName()` renders the user's input verbatim; the stories show both versions. **Root cause found in the 1 Oct capture:** the homepage strips `&` and `.` *before the flow starts*. "Start" navigates to `…/tailored-onboarding?name=Swell%20Salt%20Surf%20Co`, and the new flow greets "Let's get to know Swell Salt Surf Co". So the fix is in the homepage form handler, not in the onboarding copy.
- **Experiment fallback sends users to a different onboarding.** When the experiment service (Statsig) is unreachable, for example because an ad-blocker or corporate firewall blocks `statsigapi.net`, "Start" routes visitors to the 10-step "business guide" flow instead of the tailored onboarding. 4 of 4 fresh sessions did so while Statsig was blocked; with it reachable, every run got the tailored flow. That's worth asking about: what share of real traffic silently lands in the fallback, and is it measured as its own variant?
- **The flow changed within 5 days** (26 Sep → 1 Oct): new screen-3 question copy, "ADDED" tags instead of Remove buttons on the suites, and a full-page registration overlay. The "Sign up" / "Continue" mismatch is still live.
- **"After filling"** on the blueprint: a copy typo on the screen meant to show competence.
- **Fear framing without a check** on Branding ("If swellsaltsurfco.com or similar domain is unavailable…"), with no availability lookup. A small domain-availability component would turn the fear framing into something the user can check and act on.
