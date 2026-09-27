# Tailor Brands onboarding: reverse-engineered design system

This is a design system (tokens, components, and Storybook) for Tailor Brands' tailored-onboarding flow (`studio.tailorbrands.com/tailored-onboarding/…`), rebuilt without access to their Figma or source code. It was built for a Growth PM take-home. The flow's order, copy and defects come from [`reference/onboarding-flow-notes.md`](reference/onboarding-flow-notes.md) (observed 26 Sep 2026, desktop, mock business "Swell & Salt Surf Co.", a CA surf shop). The visual layer comes from a scripted capture of the live site.

> **Status: structure complete, visual values pending capture.** The environment this repo was built in could not reach `tailorbrands.com`: its network policy blocks the domain, and the Wayback Machine too (see [`reference/CAPTURE_LOG.md`](reference/CAPTURE_LOG.md)). So `tokens/tokens.json` currently holds neutral grayscale **placeholders**, each flagged `"$observed": false`. That follows the brief's "never invent a value" rule, and Storybook shows a banner while it's true. One command on any normal network replaces them with observed, source-linked values (see [Finishing the capture](#finishing-the-capture)). Everything else is built and verified: the components, the flow prototype, the capture → token pipeline, visual QA, and these docs.

```bash
npm install                # also builds the package (dist/) via prepare
npm run storybook          # http://localhost:6006
```

## Using the package (apps, v0)

It's an installable React package: ESM with a `"use client"` banner, type declarations, one CSS file, and a Tailwind v4 theme. It works in a Next.js App Router + Tailwind app with no provider.

```bash
npm install github:Moragron/tailor-brands-design-system
```

```css
/* app/globals.css — in this order */
@import 'tailwindcss';
@import 'tailor-brands-design-system/styles.css';
@import 'tailor-brands-design-system/tailwind.css';
```

```tsx
import { FlowLayout, ProgressStepper, ChipGroup, Button } from 'tailor-brands-design-system';
```

- **[`AGENTS.md`](AGENTS.md):** the component/prop/token contract for AI agents and developers.
- **[`examples/next-app`](examples/next-app):** a working consumer app, built in CI.
- **[`docs/v0-import.md`](docs/v0-import.md):** how to import into v0 Design Systems 2.0, with notes ready to paste.

| Entry point | Contents |
|---|---|
| `tailor-brands-design-system` | Components and hooks (see `src/index.ts`) |
| `…/styles.css` | Tokens + all component styles, in `@layer components` (Tailwind utilities override; preflight doesn't) |
| `…/tailwind.css` | Tailwind v4 `@theme inline` mapping: `bg-tb-*`, `text-tb-*`, `rounded-tb-*`, `shadow-tb-*`, `font-tb-*`, `leading-tb-*` |
| `…/base.css` | Optional `<body>` defaults |
| `…/tokens.css`, `…/tokens.json` | Raw tokens |

## What's here

| Path | What |
|---|---|
| `tokens/tokens.json` | **Source of truth.** Colours, type, spacing, radii, shadows, blur, breakpoints, layout. Each token carries `$derive` (the capture rule it comes from), `$observed`, and `$source` (file + JSON path of the capture it came from). |
| `tokens/tokens.css`, `tokens/tailwind.css` | Generated CSS custom properties (`--tb-*`, each with a provenance comment) and the Tailwind v4 theme mapping. |
| `src/index.ts` → `dist/` | Package entry; `npm run build` (`scripts/build-lib.mjs`) produces `dist/index.js`, `dist/types`, `dist/styles.css`. |
| `AGENTS.md`, `docs/v0-import.md` | Usage contract for AI agents; v0 import guide. |
| `examples/next-app` | Reference consumer app (Next.js App Router + Tailwind v4). |
| `.github/workflows` | CI (typecheck, package + Storybook build, pipeline self-test, example build) and Storybook → GitHub Pages. |
| `src/components/*` | 16 components with stories (see [component inventory](docs/component-inventory.md)). |
| `src/screens/OnboardingFlow.tsx` | All 14 screens (homepage + 13) composed **only** from the components: a click-through prototype plus one story per screen. |
| `scripts/capture.mjs` + `flow.config.mjs` + `probe.mjs` | Playwright walk of homepage/pricing and the flow → screenshots, DOM + CSS snapshots, `getComputedStyle()` per UI role. |
| `scripts/derive-tokens.mjs` | Captures → `tokens.json` → `tokens.css`, plus an audit table `reference/styles/_derivation.md`. |
| `scripts/visual-qa.mjs` | Screenshots every story, pairs it with its reference capture, pixel-diffs it, and writes `qa-report/index.html`. |
| `scripts/selftest-pipeline.mjs` | Offline proof that capture → derive works (see [Verification](#verification)). |
| `reference/` | Raw evidence: notes, screenshots, DOM, computed styles, capture log. |

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

**5. Visual QA.** `npm run qa` renders every story at 1440×900 and screenshots just the story. It pairs the story with its reference: screen stories compare against the full screenshot, and component stories with a `role` compare against the reference **cropped to that element's captured bounding box**. It runs `pixelmatch` and flags anything where more than 15 % of pixels differ. The score is a coarse filter for big deltas, not a pass/fail: AI-personalised copy will always differ.

## Verification

Done in the build environment:

- `npm run typecheck`: clean.
- `npm run build-storybook`: builds; 69 stories (62 component/screen + 7 token pages).
- **Package in a real app:** `examples/next-app` (Next.js 16 + Tailwind 4) installs the packed package and builds with both routes prerendered. In the browser, component styles survive Tailwind preflight, `text-tb-*` / `bg-tb-*` utilities resolve to the tokens, and there are no hydration errors. Every Tailwind token utility listed in `AGENTS.md` was compiled and checked.
- **Click-through test:** Playwright drove the full prototype from homepage to registration. It confirmed:
  - Next is disabled until a state is chosen
  - chips toggle `aria-checked`
  - scanning auto-advances
  - the banner dismisses
  - the 3 liability items start pre-added (Remove) and flip to Add
  - the drawer expands
  - the gate shows the observed "Sign up"/"Continue" mismatch
  - no runtime errors
- **`npm run selftest`:** runs the *real* capture probe against the built Storybook screens, runs `derive-tokens` on the output (in a temp dir), and asserts that the tokens come back out unchanged. **14/14 pass.** On its first run it caught two bugs that would have produced wrong tokens from the live site: the input border lived on a wrapper, not on the `<input>`, and a broad text match returned `<html>` instead of the banner. Both are fixed in the probe.
- **`npm run capture`:** runs, reaches the network block, logs it to `reference/CAPTURE_LOG.md`, and exits cleanly without writing any fake captures.

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

1. **All visual token values**: pending a capture (see status above). Typography, colour and spacing in Storybook today are placeholders.
2. **States never observed**: hover, active, focus, error/validation, loading, and empty/no-results, for every component. See the per-component list in the [inventory](docs/component-inventory.md).
3. **Mobile.** The notes are desktop-only. Breakpoints get inferred from `@media` rules, but mobile *behaviour* needs `npm run capture -- --viewport 390x844`.
4. **Copy not recorded:**
   - screen 4's AI-generated owner chips
   - the intermediate revenue bands
   - the "What is it" section bodies
   - the rest of the branding domain paragraph
   - the plan date line
   - Quarterly/Yearly tab content (only reachable after registering)
   - the full legal line
   - the SSO button label
5. **Post-registration screens**: not reachable without a real phone number and email. Deliberately not attempted.
6. **Personalisation is non-deterministic.** Copy on screens 4–5 and 10–12 is AI-generated per session. Captures across runs will differ in text, but not in style.

## Finishing the capture

On any machine that can reach tailorbrands.com (≈3 minutes):

```bash
npx playwright install chromium   # first time only
npm run capture                   # or: npm run capture -- --start-url https://studio.tailorbrands.com/tailored-onboarding/<id>/business-state
npm run tokens                    # tokens.json/.css now observed + reference/styles/_derivation.md
npm run build-storybook && npm run qa   # open qa-report/index.html, review flagged rows
```

If a step can't find its target (for example, if the live copy has changed), the capture saves `<screen>__FAILED.png`, logs it, and stops; it doesn't guess. Fix the matching text in `scripts/flow.config.mjs` and resume with `--start-url`. For hard cases, `--headed` lets you watch and click through manually.

## Growth notes

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
- **Name truncation** ("Swell Salt" for "Swell & Salt Surf Co.", screens 4–5). The flow's pitch is "I know your business", and it gets the business name wrong on the first personalised screen. `displayName()` renders the user's input verbatim; the stories show both versions.
- **"After filling"** on the blueprint: a copy typo on the screen meant to show competence.
- **Fear framing without a check** on Branding ("If swellsaltsurfco.com or similar domain is unavailable…"), with no availability lookup. A small domain-availability component would turn the fear framing into something the user can check and act on.
