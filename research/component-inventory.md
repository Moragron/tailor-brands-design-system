# Component inventory

Ordered by reuse across the flow, as in the brief. Screen numbers follow `onboarding-flow-notes.md` (0 = homepage, 1–13 = `/tailored-onboarding/<id>/…`).

"Observed" means the notes record it. **UNKNOWN** means it was not observed: the component either leaves it unstyled or uses a clearly marked stand-in, and the capture pipeline is set up to record it.

| # | Component | Screens | Variants observed | States observed | States NOT observed (UNKNOWN) |
|---|---|---|---|---|---|
| 1 | `ProgressStepper` | 2–7 (fraction), 10–12 (sections) | `fraction` "1/6"…"6/6"; `sections` Entity / Liability / Branding | current step | whether a bar/track accompanies "X/6"; completed-section styling; mobile layout |
| 2 | `SelectionChip` / `ChipGroup` | 4, 5, 6 | multi-select; multi-select + free-text field (screen 5) | unselected, selected (implied by selection) | hover, focus, disabled, max-selection limit, single-select on the live site (built for completeness), screen 4's chip labels (AI-generated, not recorded) |
| 2b | `SelectionCardGroup` | 7 | single-select revenue bands | unselected, selected | whether the live site uses cards or chips here; radio indicator; intermediate band labels (only "Not yet", ">$25k", "Prefer not to say" recorded) |
| 3 | `Button` | all | primary (Next, Start, Continue, Accept & Close, Add); secondary (Skip, Remove, Decline All) | default; **disabled** (Next on screen 2 until a state is chosen) | hover, active, focus, loading, sizes |
| 4 | `TextInput` | 0, 3, 13 | plain; with helper ("Plain English — a few words is plenty"); with fixed prefix "+1"; password ("At least 6 characters") | empty, filled | focus, error/validation, disabled, placeholder copy |
| 4b | `AutocompleteInput` | 2 | US state combobox | empty, typing, option chosen | menu styling (captured as `02-business-state__autocomplete-open` once capture runs), no-results state |
| 5 | `PromoBanner` | 10–12 | emoji + text, dismissible | shown, dismissed | close-icon glyph, dismiss animation, whether it stays dismissed across screens/sessions |
| 6 | `SuiteCard` + `SuiteItem` | 10 (choice), 11, 12 (toggle; on 1 Oct the live items showed an "ADDED" tag instead of a Remove button) | `toggle` Remove↔Add, items **pre-added**; `choice` Skip / Add with "*FREE" badge | added (default), removed | visual difference between added and removed rows, prices (none shown), what "Add" on the notifications card looks like once selected |
| 7 | `InfoDrawer` ("What is it") | 11 | three sections: What / Why important / What we do | closed, open | whether it expands inline or slides in as a sheet; section copy; animation |
| 8 | `PercentLoader` + `useSimulatedProgress` | 8 | % counter + rotating status line with source (bls.gov, `.docx` name) | 0→100% over ≈15 s, three messages | whether a bar exists (vs. number only), per-message timing, what happens on failure |
| 8b | `AssistantMessage` | 1, 10 | first-person persona copy | **"Thinking"** state → personalised copy | thinking visual (dots / shimmer / avatar), duration |
| 9 | `Modal` + `GatedContent` | 13 | registration gate over **blurred** content | open | close control / escape hatch, scrim colour, blur radius, mobile sheet behaviour |
| 9b | `RegistrationModal` | 13 | "Continue with Google", OR divider, first/last name, phone (+1, flag), email, password ("At least 6 characters"), "How did you discover…" select, Continue (disabled until filled), full legal line (1 Oct capture) | default, disabled Continue | validation errors, submitting |
| 10 | `TimelineTabs` + `TimelineList` | 13 | This week / Quarterly / Yearly | "This week" content (Today / Once formed) | tab shape (only seen blurred), Quarterly/Yearly content (behind the gate) |
| – | `FlowLayout` | all | page shell: header (brand + stepper/section nav), optional sticky banner, centred column, footer CTA row | — | logo asset (plain-text wordmark stand-in), mobile header, footer alignment on the live site |
| – | `PricingCard` | 0 | Lite / Essential (POPULAR) / Elite | default | CTA labels, hover, annual/monthly toggle |
| – | Cookie banner | 0 | Decline All / Accept & Close | shown | **not built**: homepage-only and outside the flow; the capture records it as `cookieBanner` |

## Flow-level patterns (composed in `src/screens/OnboardingFlow.tsx`)

| Pattern | Screens | Built as |
|---|---|---|
| Question screen: heading + input + Next gated on answer | 2–7 | `FlowLayout` + `ProgressStepper` + input component + `Button` |
| Labor-illusion loader, auto-advance | 8 | `PercentLoader` + `useSimulatedProgress(onDone)` |
| Recommendation screen: sticky promo + section nav + suite | 10–12 | `FlowLayout banner/top` + `SuiteCard` |
| Blurred report behind registration gate | 13 | `GatedContent` + `RegistrationModal` + `TimelineTabs` |

## Observed defects reproduced as stories (so fixes can be shown side by side)

| Defect | Screen | Reproduced by | Fixed variant |
|---|---|---|---|
| "Swell & Salt Surf Co." rendered as "Swell Salt" | 4, 5 | `reproduceNameBug` (default on) | `S04 Owners — name bug fixed` |
| Legal line says "Sign up", button says "Continue" | 13 | `RegistrationModal legalCtaLabel="Sign up"` | `RegistrationModal / Fixed`, `S13 … copy mismatch fixed` |
| "After filling" (should be "filing") | 9 | shown verbatim with [sic] | copy fix only, no component change |
| Pre-added opt-out add-ons with no price | 11, 12 | `preAddSuites` (default on) | `S11 Liability — opt-in variant`, `SuiteCard / Growth proposal — price shown` |
