# Tailor Brands Design System: Build Specification

A complete, standalone specification for building the **Tailor Brands design system** from scratch: design tokens plus a library of **content-free React components**. Everything needed to rebuild it faithfully is in this document. No other files or repositories are required.

---

## 0. How to use this document (instructions for the AI builder)

1. **Build exactly what is specified.** Use the token names, values, component names, props and class names given here. Don't add components, props, colours or variants that aren't listed. Where something is marked *undefined by the system*, follow §10.
2. **The system is content-free.** Components contain no product copy: every heading, label, option, button text and message is a prop. The only text a component may ship is an accessibility fallback that is never shown, such as a default `aria-label`.
3. **Tokens first, then components, then a showcase.** Build in the order of §12. Each component's styles must reference tokens (`var(--tb-…)`), never raw values, except for the few fixed pixel values this spec gives explicitly. Those are marked *(fixed)*.
4. **Use placeholder copy in demos** ("Option A", "Primary action", "Your logo"). Never invent a product, brand story or flow.
5. **Fonts are licensed and must not be loaded.** Use the font stacks exactly as given. The fallbacks render automatically. Don't add Google Fonts or any font files.

---

## 1. The look in one paragraph

White pages with a **576px content column**. **Black headings in a condensed display serif**, **grey (`#727585`) body text in a clean sans**. **Pill-shaped** buttons, chips and inputs. Primary actions are **bright blue `#166cff`** (hover `#155cba`, disabled at 30% opacity). **Selected options go bold and lift on a soft blue-tinted shadow instead of getting a border.** Overlays are white at 85% with a 12px backdrop blur. Highlight banners are **warm yellow `#ffd272`**. Spacing is on a **4px grid**. Surfaces are **flat** by default (no card shadows, no page gradient). An optional "layered" look adds a soft blue glow rising from the bottom of the page, a translucent sticky action bar and a gradient ring on the active input (§6).

Design principles:
- **One thing per page.** Focused, step-by-step screens in a narrow centred column.
- **One primary (blue) action per view.** Everything else is `secondary`.
- **Generous whitespace** and a quiet palette: colour is reserved for the primary action, progress, the banner and badges.
- **Selection is shown with weight and lift, not with colour or borders.**

---

## 2. Stack and architecture

- **React ≥ 18** (must work on React 18 and 19) + **TypeScript**, function components only.
- **Styling:** plain CSS driven by **CSS custom properties** (the tokens), plus a **Tailwind CSS** theme mapping so apps get token utilities (§5). Component styles are hand-written CSS classes, not Tailwind utility soup, so they stay stable and overridable.
- **Class naming:** every class starts with **`tb-`** and uses BEM-style suffixes: `tb-button`, `tb-button--primary`, `tb-field__input`. States are expressed with **data attributes**, e.g. `data-selected`, `data-invalid`, `data-locked`, plus ARIA attributes.
- **No provider, theme wrapper or context.** Components are plain named exports.
- **No runtime dependencies** besides React. No component library (no shadcn/ui, Radix or MUI) inside the design system.
- **Overridability:** component styles must lose to utility classes passed via `className`. With Tailwind 4, put component CSS in `@layer components` and tokens in `@layer theme`. With Tailwind 3, leave component CSS unlayered and import it before the `@tailwind` directives.
- **Scoped resets only:** never style bare elements (`button`, `input`, `body`) in the component CSS. Host-app styles and Tailwind preflight must neither break the components nor be changed by them.
- **SSR-safe:** touch `window`/`document` only inside effects.
- **Public API:** one barrel `src/index.ts` that `export *`s every component file. Components never import CSS from JS. The app imports one CSS entry (tokens + component styles + Tailwind theme).

Suggested file layout:

```
src/
  index.ts                         # barrel: export * from each component
  components/<Name>/<Name>.tsx     # component + its exported prop types
  components/<Name>/<Name>.css     # its styles (tb- classes only)
  styles/tokens.css                # :root { --tb-… } (§4)
  styles/foundation.css            # shared helpers + typography classes (§4.4)
  styles/components.css            # @imports foundation + every component css
  styles/theme.css                 # Tailwind 4 @theme inline mapping (§5)
  styles/index.css                 # entry: layers + tokens + components + theme
  styles/depth.css                 # optional layered look (§6)
  styles/base.css                  # optional <body> defaults (§4.5)
```

---

## 3. Token naming

`--tb-<group>-<role>[-<variant>]`. Groups: `color`, `font-family`, `font-size`, `font-weight`, `font-line-height`, `space`, `radius`, `shadow`, `effect`, `breakpoint`, `layout`.

Values marked **placeholder** were not measured from the source design and are neutral stand-ins. Keep them, but they're the first candidates to adjust.

---

## 4. Tokens (complete)

### 4.1 Ready-to-paste `tokens.css`

```css
:root {
  /* Colour: text */
  --tb-color-text-primary: #000000;
  --tb-color-text-body: #727585;
  --tb-color-text-muted: #727585;
  /* Colour: surfaces and borders */
  --tb-color-surface-page: #ffffff;
  --tb-color-surface-card: #ffffff;
  --tb-color-surface-muted: #f4f4f4;            /* placeholder */
  --tb-color-border-default: #dfe2e6;
  --tb-color-border-card: #d1d5db;
  /* Colour: actions */
  --tb-color-action-primary-bg: #166cff;
  --tb-color-action-primary-fg: #ffffff;
  --tb-color-action-primary-hover-bg: #155cba;
  --tb-color-action-primary-disabled-bg: rgba(22, 108, 255, 0.3);
  --tb-color-action-primary-disabled-fg: #ffffff;
  --tb-color-action-secondary-bg: #ffffff;
  --tb-color-action-secondary-fg: #000000;
  --tb-color-action-secondary-border: #d1d5db;
  /* Colour: chips (selection) */
  --tb-color-chip-bg: #ffffff;
  --tb-color-chip-fg: #000000;
  --tb-color-chip-border: #dfe2e6;
  --tb-color-chip-selected-bg: #ffffff;
  --tb-color-chip-selected-fg: #000000;
  --tb-color-chip-selected-border: transparent; /* selection = weight + shadow, not a border */
  /* Colour: banner, badge, progress, overlay, feedback */
  --tb-color-banner-bg: #ffd272;
  --tb-color-banner-fg: #000000;
  --tb-color-badge-bg: transparent;              /* placeholder */
  --tb-color-badge-fg: #0b825b;
  --tb-color-progress-fill: #166cff;
  --tb-color-progress-track: rgba(0, 0, 0, 0.1);
  --tb-color-overlay-scrim: rgba(255, 255, 255, 0.85);
  --tb-color-feedback-error: #6b6b6b;            /* placeholder: neutral, not red */

  /* Typography */
  --tb-font-family-base: proxima-nova, helvetica, arial, sans-serif;
  --tb-font-family-heading: Memories, Georgia, "Times New Roman", serif;
  --tb-font-size-h1: 28px;
  --tb-font-size-h2: 29.04px;
  --tb-font-size-h3: 18px;                       /* placeholder */
  --tb-font-size-body: 15px;
  --tb-font-size-caption: 16px;
  --tb-font-size-button: 16px;
  --tb-font-weight-h1: 500;
  --tb-font-weight-h2: 400;
  --tb-font-weight-body: 400;
  --tb-font-weight-button: 400;
  --tb-font-weight-chip-selected: 600;
  --tb-font-line-height-h1: 36.4px;
  --tb-font-line-height-h2: 36.3px;
  --tb-font-line-height-body: 24px;

  /* Spacing: 4px base */
  --tb-space-base: 4px;
  --tb-space-1: 4px;
  --tb-space-2: 8px;
  --tb-space-3: 12px;
  --tb-space-4: 16px;
  --tb-space-5: 20px;
  --tb-space-6: 24px;
  --tb-space-8: 32px;
  --tb-space-10: 40px;
  --tb-space-12: 48px;

  /* Radius */
  --tb-radius-button: 9999px;
  --tb-radius-input: 9999px;
  --tb-radius-chip: 9999px;
  --tb-radius-card: 16px;
  --tb-radius-modal: 0px;
  --tb-radius-banner: 0px;

  /* Shadow: flat by default */
  --tb-shadow-card: none;
  --tb-shadow-modal: none;
  --tb-shadow-chip-selected: rgba(134, 153, 237, 0.35) 0px 8px 24px -8px, rgba(61, 88, 143, 0.25) 0px 4px 12px -4px;

  /* Effects */
  --tb-effect-backdrop-blur: 12px;
  --tb-effect-page-gradient: none;               /* placeholder; the layered look sets it (§6) */
  --tb-effect-badge-gradient: none;

  /* Breakpoints (reference values: CSS variables can't be used in media queries) */
  --tb-breakpoint-sm: 577px;
  --tb-breakpoint-md: 720px;
  --tb-breakpoint-lg: 993px;

  /* Layout */
  --tb-layout-content-max-width: 576px;
}
```

### 4.2 Notes on the values

- **Typography quirks are intentional:** `h2` (29.04px) is slightly larger than `h1` (28px) but lighter (400 vs 500). `caption` (16px) is larger than `body` (15px): captions are secondary because they're **muted**, not because they're small.
- **Body and muted text share `#727585`.** Hierarchy comes from size, weight and the black headings.
- **The error colour is a neutral grey placeholder.** Don't introduce red. Errors are communicated with text plus `aria-invalid`.
- **Breakpoints:** mobile-first; `sm` 577px, `md` 720px, `lg` 993px. Use the literal values in `@media` queries.

### 4.3 Token roles at a glance

| Role | Token(s) |
|---|---|
| Headings | `text-primary` + `font-family-heading` |
| Body copy | `text-body` + `font-family-base` |
| Secondary text, captions, helper text, counters | `text-muted` |
| Page / card background | `surface-page` / `surface-card` |
| Subtle fill (tab track, drawer panel, active list option) | `surface-muted` |
| Input and chip outlines | `border-default` |
| Card, list-divider and secondary-button outlines | `border-card` |
| The one primary action | `action-primary-*` |
| Everything else clickable | `action-secondary-*` |
| Selected state (chips, selection cards, add-on title) | `chip-selected-*`, `shadow-chip-selected`, `font-weight-chip-selected` |

### 4.4 Foundation CSS (shared helpers + typography classes)

```css
/* Scoped box-sizing: only elements with a tb- class. */
:where([class^='tb-'], [class*=' tb-']),
:where([class^='tb-'], [class*=' tb-'])::before,
:where([class^='tb-'], [class*=' tb-'])::after { box-sizing: border-box; }
/* Component display rules (grid/flex) must not defeat the hidden attribute. */
[class*='tb-'][hidden] { display: none !important; }

.tb-h1 { font-family: var(--tb-font-family-heading); font-size: var(--tb-font-size-h1); font-weight: var(--tb-font-weight-h1); line-height: var(--tb-font-line-height-h1); color: var(--tb-color-text-primary); margin: 0; }
.tb-h2 { font-family: var(--tb-font-family-heading); font-size: var(--tb-font-size-h2); font-weight: var(--tb-font-weight-h2); line-height: var(--tb-font-line-height-h2); color: var(--tb-color-text-primary); margin: 0; }
.tb-h3 { font-family: var(--tb-font-family-heading); font-size: var(--tb-font-size-h3); font-weight: var(--tb-font-weight-h2); color: var(--tb-color-text-primary); margin: 0; }
.tb-body { font-family: var(--tb-font-family-base); font-size: var(--tb-font-size-body); line-height: var(--tb-font-line-height-body); color: var(--tb-color-text-body); margin: 0; }
.tb-caption { font-family: var(--tb-font-family-base); font-size: var(--tb-font-size-caption); color: var(--tb-color-text-muted); margin: 0; }

/* Keyboard focus ring (every interactive tb- element gets this class). */
.tb-focusable:focus-visible { outline: 2px solid var(--tb-color-text-primary); outline-offset: 2px; }
/* Screen-reader-only text. */
.tb-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

### 4.5 Optional page defaults (`base.css`)

For apps that are entirely on this system. Opt-in, because it styles `<body>`:

```css
body {
  margin: 0;
  background-color: var(--tb-color-surface-page);
  background-image: var(--tb-effect-page-gradient); /* none unless the layered look is on */
  background-repeat: no-repeat;
  color: var(--tb-color-text-body);
  font-family: var(--tb-font-family-base);
  font-size: var(--tb-font-size-body);
  line-height: var(--tb-font-line-height-body);
}
```

---

## 5. Tailwind mapping

Map tokens to Tailwind theme keys so apps get utilities with the **`tb-` prefix in the utility name**. Values must stay `var(--tb-…)` references (Tailwind 4: `@theme inline`) so changing a token restyles everything.

| Token group | Tailwind 4 theme variable | Tailwind 3 `theme.extend` key | Example utilities |
|---|---|---|---|
| `color-*` | `--color-tb-<role>` | `colors['tb-<role>']` | `bg-tb-surface-card`, `text-tb-text-muted`, `border-tb-border-card`, `bg-tb-action-primary-bg`, `bg-tb-banner-bg` |
| `font-family-*` | `--font-tb-<name>` | `fontFamily['tb-<name>']` | `font-tb-base`, `font-tb-heading` |
| `font-size-*` | `--text-tb-<name>` | `fontSize['tb-<name>']` | `text-tb-h1` … `text-tb-caption`, `text-tb-button` |
| `font-weight-*` | `--font-weight-tb-<name>` | `fontWeight['tb-<name>']` | `font-tb-h1`, `font-tb-button`, `font-tb-chip-selected` |
| `font-line-height-*` | `--leading-tb-<name>` | `lineHeight['tb-<name>']` | `leading-tb-body` |
| `radius-*` | `--radius-tb-<name>` | `borderRadius['tb-<name>']` | `rounded-tb-button`, `rounded-tb-chip`, `rounded-tb-card` |
| `shadow-*` | `--shadow-tb-<name>` | `boxShadow['tb-<name>']` | `shadow-tb-chip-selected` |
| `space-*`, `effect-*`, `breakpoint-*`, `layout-*` | *(not mapped)* | *(not mapped)* | Use the CSS variable directly: `p-(--tb-space-4)` (v4) / `p-[var(--tb-space-4)]` (v3) |

Tailwind 4 example (`theme.css`):

```css
@theme inline {
  --color-tb-text-primary: var(--tb-color-text-primary);
  /* …one line per colour token… */
  --font-tb-base: var(--tb-font-family-base);
  --font-tb-heading: var(--tb-font-family-heading);
  --text-tb-h1: var(--tb-font-size-h1);
  /* … */
  --font-weight-tb-h1: var(--tb-font-weight-h1);
  --leading-tb-body: var(--tb-font-line-height-body);
  --radius-tb-card: var(--tb-radius-card);
  --shadow-tb-chip-selected: var(--tb-shadow-chip-selected);
  /* layered-look colours (§6) */
  --color-tb-glow: var(--tb-color-glow);
  --color-tb-divider: var(--tb-color-divider);
}
```

Tailwind 4 CSS entry (`styles/index.css`), imported right after `@import "tailwindcss"` in the app:

```css
@layer theme, base, components, utilities;
@import './tokens.css' layer(theme);
@import './components.css' layer(components);
@import './theme.css';
```

**If the app also uses shadcn/ui** (optional bridge): point its theme variables at the tokens so any shadcn component stays on-brand.

| shadcn variable | token |
|---|---|
| `--background` | `--tb-color-surface-page` |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--accent-foreground` | `--tb-color-text-primary` |
| `--card`, `--popover` | `--tb-color-surface-card` |
| `--primary` / `--primary-foreground` | `--tb-color-action-primary-bg` / `-fg` |
| `--secondary` / `--secondary-foreground` | `--tb-color-action-secondary-bg` / `-fg` |
| `--muted`, `--accent` | `--tb-color-surface-muted` |
| `--muted-foreground` | `--tb-color-text-muted` |
| `--destructive` / `--destructive-foreground` | `--tb-color-feedback-error` / `--tb-color-action-primary-fg` |
| `--border`, `--input` | `--tb-color-border-default` |
| `--ring` | `--tb-color-action-primary-bg` |
| `--radius` | `--tb-radius-card` |

(shadcn on Tailwind 3 expects HSL triplets such as `217.9 100% 54.3%`, so convert the hex values for it.)

---

## 6. Optional layered look ("depth")

The measured design is **flat**. The layered look is an **opt-in stylesheet**. It changes no component API, and a page opts back out with `<html data-tb-depth="flat">`. All selectors are prefixed with `:root:not([data-tb-depth='flat'])`.

**Extra variables** (colours sampled from a reference screenshot of the questionnaire flow):

```css
:root:not([data-tb-depth='flat']) {
  --tb-color-glow: #dde8f5;             /* bottom-of-page blue haze */
  --tb-color-divider: #dfe7ef;          /* hairline under header / above action bar */
  --tb-color-accent-pink: #d46fbb;      /* gradient ring, start */
  --tb-color-accent-violet: #b760c8;    /* gradient ring, middle */
  --tb-color-accent-blue: #6074d8;      /* gradient ring, end */
  --tb-color-input-tint: #eef2fe;       /* faint blue inside the active input */

  --tb-effect-page-gradient:
    radial-gradient(60% 60% at 50% 95%, var(--tb-color-glow) 0%, color-mix(in srgb, var(--tb-color-glow) 55%, transparent) 45%, transparent 100%);
  --tb-effect-section-gradient: linear-gradient(180deg, var(--tb-color-surface-page) 0%, var(--tb-color-glow) 100%);
  --tb-effect-accent-gradient: linear-gradient(80deg, var(--tb-color-accent-pink) 0%, var(--tb-color-accent-violet) 30%, var(--tb-color-accent-blue) 80%, var(--tb-color-accent-blue) 100%);
  --tb-effect-input-fill: linear-gradient(90deg, var(--tb-color-surface-card) 45%, var(--tb-color-input-tint) 100%);
  --tb-effect-bar-bg: color-mix(in srgb, var(--tb-color-surface-page) 35%, transparent);
}
```

**Rules** (same cascade layer as components, so `className` utilities still win):

```css
/* Hairline under the StepLayout header */
:root:not([data-tb-depth='flat']) .tb-step-layout__header { border-bottom: 1px solid var(--tb-color-divider); }
/* Sticky, translucent, blurred action bar: the page glow shows through it */
:root:not([data-tb-depth='flat']) .tb-step-layout__footer {
  position: sticky; bottom: 0; z-index: 5;
  background: var(--tb-effect-bar-bg);
  backdrop-filter: blur(var(--tb-effect-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--tb-effect-backdrop-blur));
  border-top: 1px solid var(--tb-color-divider);
}
/* Focused (or answered autocomplete) input: 2px gradient ring + faint blue fill; replaces the black focus outline */
:root:not([data-tb-depth='flat']) :is(.tb-field__control:focus-within, .tb-field__control[data-filled]):not([data-invalid]),
:root:not([data-tb-depth='flat']) .tb-chip-group__free-text:focus {
  border: 2px solid transparent;
  background: var(--tb-effect-input-fill) padding-box, var(--tb-effect-accent-gradient) border-box;
  outline: 0;
}
/* Keep field height stable when the border goes from 1px to 2px */
:root:not([data-tb-depth='flat']) :is(.tb-field__control:focus-within, .tb-field__control[data-filled]):not([data-invalid]) .tb-field__input { padding: calc(var(--tb-space-3) - 1px) calc(var(--tb-space-4) - 1px); }
:root:not([data-tb-depth='flat']) .tb-chip-group__free-text:focus { padding: calc(var(--tb-space-3) - 1px) calc(var(--tb-space-4) - 1px); }
```

Because `StepLayout` paints `--tb-effect-page-gradient` as its background, **every questionnaire page built with `StepLayout` gets the glow automatically**. Never recreate the background by hand. Utilities for custom elements: `bg-tb-glow`, `border-tb-divider`, `bg-(image:--tb-effect-section-gradient)` (Tailwind 4), and `--tb-effect-accent-gradient` for an accent line or ring (use sparingly).

---

## 7. Components

Every component is a **named export**. Prop types are exported as `<Name>Props`. Interactive elements carry `tb-focusable`. All visible strings are props.

### 7.1 `StepLayout`: page shell

Use for every page of a focused, step-by-step experience.

```ts
type StepLayoutProps = {
  brand?: ReactNode;   // left of the header: logo or wordmark
  top?: ReactNode;     // right of the header: usually <ProgressStepper/>
  banner?: ReactNode;  // above the header: usually a sticky <PromoBanner/>
  children: ReactNode; // page content
  footer?: ReactNode;  // bottom action row: usually <Button>s
};
```

**Markup:** `div.tb-step-layout` › `{banner}` › `header.tb-step-layout__header` (only if `brand` or `top`) containing `span.tb-step-layout__brand` + `{top}` › `main.tb-step-layout__main` › `footer.tb-step-layout__footer` › `div.tb-step-layout__footer-inner` (only if `footer`).

**Styles:**
- Root: `min-height: 100dvh`; flex column; background-colour `surface-page` + background-image `--tb-effect-page-gradient`; text `text-body`, `font-family-base`, `font-size-body`, `line-height-body`; `position: relative`.
- Header: flex, centred vertically, `space-between`, gap `space-4`, padding `space-4 space-6`. The brand slot is weight `chip-selected` (600) in `text-primary`.
- Main: `flex: 1`, centred, `max-width: calc(layout-content-max-width + 2 × space-4)` (= 608px including gutters); padding `space-8 space-4`; `display: grid; gap: space-5; align-content: start`.
- Footer inner: same max-width, centred, padding `space-4`, flex, `space-between`, gap `space-2`. **A single child is pushed to the right** (`> :only-child { margin-left: auto }`). Two children (Back + Continue) sit at opposite ends.

### 7.2 `Button`

```ts
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'; // default 'primary'
  fullWidth?: boolean;
};
```

- Renders `<button type="button">` by default, with class `tb-button tb-button--{variant} tb-focusable` (+ `tb-button--full`) and any passed `className`. Forwards all native props.
- Base: font `font-family-base`, `font-size-button`, `font-weight-button`; **radius `radius-button` (pill)**; padding `space-3 space-6`; `1px solid transparent` border; pointer cursor.
- Primary: bg `action-primary-bg`, text `action-primary-fg`; **hover (when enabled): `action-primary-hover-bg`**.
- Secondary: bg `action-secondary-bg`, text `action-secondary-fg`, border `action-secondary-border`.
- **Disabled (both variants):** bg `action-primary-disabled-bg` (30% blue), text `action-primary-disabled-fg`, transparent border, `not-allowed` cursor.
- Full width: `width: 100%`.
- *Undefined by the system:* active/pressed and loading states (see §10).

### 7.3 `ProgressStepper`

```ts
type ProgressStepperProps =
  | { variant?: 'fraction'; current: number; total: number }
  | { variant: 'sections'; sections: string[]; activeIndex: number };
```

- **Fraction:** `div.tb-stepper.tb-stepper--fraction` with `aria-label="Step {current} of {total}"`, rendering `"{current}/{total}"`. Styles: `font-size-caption`, `text-muted`, `font-variant-numeric: tabular-nums`.
- **Sections:** `nav.tb-stepper.tb-stepper--sections[aria-label="Progress"]` › `ol` › one `li` per section, with `data-state = complete | active | upcoming` and `aria-current="step"` on the active one. The `ol` is a flex row with gap `space-6`, no list styling. Each `li`: `font-size-caption`, `text-muted`, padding-bottom `space-2`, `2px` transparent bottom border. **Active:** `text-primary`, weight 600, bottom border `text-primary` (an underline tab).

### 7.4 `SelectionChip` and `ChipGroup`: short options

```ts
type SelectionChipProps = { label: ReactNode; selected: boolean; onToggle: () => void; mode?: 'multi' | 'single' };
type ChipGroupProps = {
  label: string;                 // accessible name of the group (usually the question)
  options: string[];
  value: string[];               // selected options (single mode: 0 or 1 item)
  onChange: (value: string[]) => void;
  mode?: 'multi' | 'single';     // default 'multi'
  freeText?: { placeholder?: string; label?: string; value: string; onChange: (v: string) => void };
};
```

- **Chip:** `<button type="button">` with `role="checkbox"` (multi) or `role="radio"` (single), `aria-checked`, class `tb-chip tb-focusable`, `data-selected` when selected.
  - Rest: `font-size-body`, bg `chip-bg`, text `chip-fg`, border `1px chip-border`, **radius `radius-chip` (pill)**, shadow `shadow-card` (none), padding `space-2 space-4`.
  - **Selected:** bg `chip-selected-bg` (white), border `chip-selected-border` (**transparent**), **shadow `shadow-chip-selected`**, **weight 600**. Selection is shown by lift and boldness only.
- **Group:** `div.tb-chip-group` (grid, gap `space-4`) › chips container with `role="group"` (multi) or `role="radiogroup"` (single), `aria-labelledby` pointing at a visually hidden `span` holding `label`; flex-wrap, gap `space-2`.
  - Multi mode toggles an option in or out of `value`. Single mode sets `value` to `[option]`.
- **Free-text field** (when `freeText` is set): an `input.tb-chip-group__free-text.tb-focusable` under the chips, with `aria-label = freeText.label ?? "{label}: other"`. Padding `space-3 space-4`, border `1px border-default`, **radius `radius-input` (pill)**, bg `surface-card`, text `text-body`.
- *Undefined:* hover, disabled and max-selection states.

### 7.5 `SelectionCardGroup`: single choice with descriptions

```ts
type SelectionCardOption = { value: string; label: ReactNode; description?: ReactNode };
type SelectionCardGroupProps = { label: string; options: SelectionCardOption[]; value: string | null; onChange: (value: string) => void };
```

- `div.tb-card-group[role=radiogroup]` (grid, gap `space-2`), labelled by a visually hidden span.
- Each option: `button.tb-selection-card.tb-focusable[role=radio]` with `aria-checked`, `data-selected`, and **roving tabindex** (only the selected option, or the first, has `tabIndex=0`). **Arrow keys** (↑/← previous, ↓/→ next, wrapping) move focus **and** select.
- Card: flex row, centred, gap `space-3`, left-aligned text, full width; bg `surface-card`, text `text-body`, border `1px border-card`, **radius `radius-card` (16px)**, shadow `shadow-card`, padding `space-4`.
- Radio dot: `span.tb-selection-card__radio` (`aria-hidden`), **18×18px *(fixed)***, circle, `1px border-default`, bg `surface-card`. **Selected: a `5px` *(fixed)* border in `action-primary-bg`** (a blue ring).
- Text: `label` on its own line, then the optional `description` in `font-size-caption`, `text-muted`.
- **Selected card:** border `chip-selected-border` (transparent), bg `chip-selected-bg`, shadow `shadow-chip-selected`, weight 600. It reuses the chip-selected tokens.

### 7.6 `TextInput`

```ts
type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  label: string;          // required, even when hidden
  hideLabel?: boolean;    // visually hide when a heading already asks the question
  helper?: ReactNode;
  prefix?: ReactNode;     // fixed prefix inside the field, e.g. "+1" or "$"
  error?: ReactNode;
};
```

- Forwards a `ref` to the `<input>`. Uses the passed `id` or an auto `useId()`.
- **Markup:** `div.tb-field` › `label[for]` (`.tb-field__label`, or `.tb-visually-hidden` when `hideLabel`) › `div.tb-field__control` (`data-invalid` when `error`) › optional `span.tb-field__prefix` + `input.tb-field__input` › optional `p.tb-caption#{id}-helper` › optional `p.tb-field__error#{id}-error`.
- The input gets `aria-invalid` when `error` is set, and `aria-describedby` = helper id + error id.
- **Styles:**
  - Field: grid, single column (`minmax(0,1fr)`), gap `space-2`, `min-width: 0`.
  - Label: `font-size-caption`, `text-body`.
  - Control: flex, centred, border `1px border-default`, **radius `radius-input` (pill)**, bg `surface-card`. **Focus (`:focus-within`):** `2px solid text-primary` outline, offset 1px. **Invalid:** border `feedback-error`.
  - Prefix: padding-left `space-4`, `text-muted`.
  - Input: `flex: 1`, transparent background, no border or outline, `text-body`, padding `space-3 space-4`.
  - Error text: `font-size-caption`, `feedback-error`.

### 7.7 `AutocompleteInput`: pick one value from a long list

```ts
type AutocompleteInputProps = {
  label: string; hideLabel?: boolean;
  options: string[];
  value: string | null;                 // only a chosen option sets a value
  onChange: (value: string | null) => void;
  placeholder?: string;
  maxResults?: number;                  // default 8
};
```

- **WAI-ARIA 1.2 combobox.** Reuses the `tb-field` / `tb-field__control` / `tb-field__input` styles from §7.6, plus `.tb-autocomplete { position: relative }`.
- The input has `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-activedescendant`.
- **Filtering:** case-insensitive "contains" on the trimmed query, capped at `maxResults`.
- **Behaviour:**
  - Typing opens the list, resets the active option to the first, and **clears an existing `value` (`onChange(null)`)**. Free text alone never counts as an answer.
  - Focus opens the list; blur closes it after ~120ms, so clicks on options register.
  - **Keys:** ↓ opens the list and moves down, ↑ moves up, Enter chooses the active option, Escape closes.
  - Choosing an option calls `onChange(option)`, fills the input and closes the list. The list uses `onMouseDown` + `preventDefault`, so the input doesn't blur first.
  - The list shows only when it's open, the query is non-empty and there are matches.
- The control gets `data-filled` when a value is chosen; the layered look rings it (§6).
- **List:** `ul.tb-autocomplete__list[role=listbox]`, absolutely positioned under the field (`top: 100%`, full width, `z-index: 10`). Margin-top `space-1`, padding `space-1 0`, bg `surface-card`, border `1px border-card`, radius `radius-input`, shadow `shadow-modal`. Options are `li[role=option]` with `aria-selected` and `data-active`, padding `space-2 space-4`; **active option bg `surface-muted`**.

### 7.8 `PromoBanner`: announcement strip

```ts
type PromoBannerProps = {
  icon?: ReactNode;        // optional leading emoji/icon (aria-hidden)
  children: ReactNode;     // the message
  onDismiss?: () => void;  // omit for a non-dismissible banner
  dismissLabel?: string;   // default 'Dismiss' (aria-label only)
  label?: string;          // region name, default 'Announcement'
  sticky?: boolean;        // default true
};
```

- `div.tb-promo[role=region][aria-label]`. Flex, centred, gap `space-2`; bg `banner-bg` (yellow), text `banner-fg`; radius `radius-banner` (0); padding `space-3 space-4`; `font-family-base`, `font-size-caption`.
- Sticky: `position: sticky; top: 0; z-index: 5`.
- Dismiss: a `button.tb-promo__close.tb-focusable` showing "×", `font-size: 18px` *(fixed)*, `line-height: 1`, no background or border, inherits colour, padding `space-1`, **`margin-left: auto`** (pinned right).

### 7.9 `AddOnCard` + `AddOnItem`: titled list of optional items

```ts
type AddOnCardProps = { title: string; children: ReactNode /* AddOnItem elements */ };
type AddOnItemProps = {
  title: string;
  badge?: string;                 // small tag, e.g. "New"
  description?: ReactNode;
  price?: ReactNode;
  info?: { triggerLabel: string; sections: { heading: string; body: ReactNode }[] }; // renders an InfoDrawer
  mode?: 'toggle' | 'choice';     // default 'toggle'
  added: boolean;
  onChange: (added: boolean) => void;
  addLabel?: string;              // default 'Add'
  removeLabel?: string;           // default 'Remove'
  skipLabel?: string;             // default 'Skip'
};
```

- **Card:** `section.tb-addon[aria-label=title]`: bg `surface-card`, border `1px border-card`, radius `radius-card`, shadow `shadow-card`, padding `space-5`.
  - Title `h3.tb-addon__title`: margin-bottom `space-3`, `font-family-base`, `font-size-caption`, **uppercase, letter-spacing 0.06em**, `text-muted`.
  - Items: `ul.tb-addon__items` (no list style, grid).
- **Item:** `li.tb-addon-item` (`data-added`): flex, gap `space-4`, top-aligned, `space-between`; padding `space-4 0`; **border-top `1px border-card` except on the first item**.
  - Main column: grid, gap `space-1`, `flex: 1`.
  - Title row: weight 600, `text-primary`, flex, gap `space-2`, wrap. It holds the title, an optional `span.tb-badge` and an optional price (weight `body`, `text-muted`).
  - Optional description `p.tb-caption`; optional `InfoDrawer`.
  - Actions: flex, gap `space-2`, `flex: none`.
- **Toggle mode:** one `Button`: `primary` showing `addLabel` when not added, `secondary` showing `removeLabel` when added. `aria-pressed={added}`; clicking flips the value.
- **Choice mode:** two buttons: `secondary` `skipLabel` (`aria-pressed={!added}`, sets false) and `primary` `addLabel` (`aria-pressed={added}`, sets true).
- **Badge (`.tb-badge`, shared with PricingCard):** `font-size: 11px` *(fixed)*, weight 600, uppercase, letter-spacing 0.04em, bg `badge-bg`, text `badge-fg` (green), **border `1px solid currentColor`**, radius `radius-chip` (pill), padding `1px space-2`.

### 7.10 `InfoDrawer`: inline "learn more" disclosure

```ts
type InfoDrawerProps = { triggerLabel: string; sections: { heading: string; body: ReactNode }[]; defaultOpen?: boolean };
```

- Trigger: `button.tb-info-drawer__trigger.tb-focusable` with `aria-expanded` and `aria-controls`. `font-size-caption`, `text-primary`, **underlined**, no background or border or padding, `inline-flex`, gap `space-1`. It ends with a "▾" chevron (`aria-hidden`) that **rotates 180° when open** (transition 0.15s).
- Panel: `div.tb-info-drawer__panel` with the `hidden` attribute when closed. Grid, gap `space-3`, margin-top `space-3`, padding `space-4`, **bg `surface-muted`**, radius `radius-card`. Each section is an `h4` heading (`font-size-caption`, weight `button`, `text-primary`, margin-bottom `space-1`) + body (`font-size-caption`).

### 7.11 `PercentLoader` + `useSimulatedProgress`

```ts
type LoaderMessage = { text: string; source?: string };
type PercentLoaderProps = { percent: number; label: string; headline?: string; message?: LoaderMessage };
function useSimulatedProgress(messages: LoaderMessage[], durationMs?: number /* 15000 */, onDone?: () => void): { percent: number; message: LoaderMessage };
```

- **Loader:** `div.tb-loader` (grid, gap `space-4`, `max-width: layout-content-max-width`).
  - Optional `h2.tb-h2` headline.
  - Big percentage, clamped 0–100 and rounded: `font-size-h1`, `font-weight-h1`, `text-primary`, tabular numbers, `aria-hidden`.
  - Track `div.tb-loader__track[role=progressbar]` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow`, `aria-label=label`: **height 8px *(fixed)***, bg `progress-track`, radius `radius-chip`, overflow hidden. The fill is `progress-fill` (blue) at `width: {p}%`.
  - Optional status `div.tb-loader__status[aria-live=polite]`: grid, gap `space-1`, `min-height: 3em` (no layout jump). It holds `p.tb-body` text + optional `p.tb-caption` source.
- **Hook:** drives `percent` from 0 to 100 over `durationMs` with `requestAnimationFrame`. It rotates `messages` evenly across the duration (`messages[floor(progress × count)]`, capped at the last one) and calls `onDone` once at 100%.

### 7.12 `AssistantMessage`: conversational message with a loading state

```ts
type AssistantMessageProps = { thinking?: boolean; thinkingLabel?: string; children?: ReactNode };
```

- `div.tb-assistant` with `aria-live="polite"`, plus `aria-busy` while thinking. Styles: `font-size-body`, `text-body`, grid, gap `space-3`; paragraphs inside get margin 0.
- **Thinking:** shows `thinkingLabel` (or a visually hidden "Loading" fallback) in `text-muted`, followed by three animated dots (`aria-hidden`). Keyframes `tb-blink`: opacity 0.2 → 1 → 0.2 over 1.2s, infinite, staggered 0 / 0.2s / 0.4s. **No animation under `prefers-reduced-motion: reduce`.**
- Otherwise it renders `children`.

### 7.13 `Modal` + `GatedContent`

```ts
type ModalProps = { open: boolean; title: ReactNode; children: ReactNode; onClose?: () => void; closeLabel?: string /* 'Close' */ };
type GatedContentProps = { children: ReactNode; locked: boolean; gate: ReactNode /* usually a <Modal> */ };
```

- **Modal** renders **in place, not in a portal**, so it can sit over `GatedContent`. It returns `null` when closed.
  - Scrim `div.tb-modal__scrim`: relative, `z-index: 20`, grid, centred horizontally, **aligned to the top**, padding `space-12 space-4`, **bg `overlay-scrim` (white 85%)**.
  - Dialog `div.tb-modal[role=dialog][aria-modal=true][aria-labelledby]`: full width up to **440px *(fixed)***, grid (single column), gap `space-4`, bg `surface-card`, radius `radius-modal` (0), shadow `shadow-modal` (none), padding `space-8 space-6`.
  - Title: `h2.tb-h2.tb-modal__title`, **centred**.
  - **On open:** focus the first `input/select/textarea`, otherwise the first `button/[tabindex]`. **Escape** calls `onClose`.
  - With `onClose`: a close `button.tb-modal__close.tb-focusable` showing "×" with `aria-label=closeLabel`, absolutely placed `top/right: space-3`, `font-size: 22px` *(fixed)*, `text-muted`, no background or border. Without `onClose`, the modal is an undismissable gate.
- **GatedContent:** `div.tb-gated` is a grid with `min-height: 640px` *(fixed)*. The content and the gate **share one grid cell** (`grid-area: 1/1`), so the container grows to whichever is taller.
  - When `locked`, the content gets `data-locked` and `aria-hidden`, plus the **`inert` DOM property set through a ref in an effect** (not as a JSX prop, for React 18 compatibility). It's styled `filter: blur(var(--tb-effect-backdrop-blur))`, with no pointer events or selection.
  - The gate renders only while locked.

### 7.14 `Tabs` + `GroupedList`

```ts
type TabItem = { id: string; label: string; content: ReactNode };
type TabsProps = { tabs: TabItem[]; defaultTab?: string };
type ListGroup = { heading: string; items: ReactNode[] };
function GroupedList(props: { groups: ListGroup[] }): JSX.Element;
```

- **Tabs** follow the WAI-ARIA tabs pattern.
  - `div[role=tablist].tb-tabs__list` is a **segmented pill control**: `inline-flex`, gap `space-1`, padding `space-1`, bg `surface-muted`, radius `radius-chip`.
  - Each tab is `button[role=tab].tb-tabs__tab.tb-focusable` with `aria-selected`, `aria-controls` and roving `tabIndex`. Styles: `font-size-caption`, transparent bg, no border, radius `radius-chip`, padding `space-2 space-4`, `text-muted`. **Selected:** bg `surface-card`, `text-primary`, weight 600.
  - **←/→** move between tabs, wrapping, and activate them.
  - Panels are `div[role=tabpanel]` with `aria-labelledby` and `hidden` when inactive, padding-top `space-5`.
- **GroupedList:** grid, gap `space-5`. Each group is a `section` with an `h4` heading (margin-bottom `space-2`, `font-size-caption`, `text-muted`, **uppercase, letter-spacing 0.06em**) + `ul` (no list style, grid). Each `li` has padding `space-3 0` and border-top `1px border-card`.

### 7.15 `PricingCard`

```ts
type PricingCardProps = {
  name: string; price: string; period?: string; priceNote?: string;
  badge?: string; features: ReactNode[];
  ctaLabel?: string; onCtaClick?: () => void;   // full-width button when ctaLabel is set
  highlighted?: boolean;
};
```

- `article.tb-pricing` (`data-highlighted`): grid, gap `space-3`, `align-content: start`, bg `surface-card`, border `1px border-card`, radius `radius-card`, shadow `shadow-card`, padding `space-6`. **Highlighted:** a **2px** border in `action-primary-bg`.
- Header: flex, gap `space-2`: `h3.tb-h3` name + optional `.tb-badge`.
- Price row: flex, **baseline-aligned**, gap `space-1`: price in `tb-h1` + optional period in `tb-caption`.
- Optional `priceNote` as `p.tb-caption`.
- Features: `ul` with padding-left `space-5` (normal bullets), grid, gap `space-2`, `font-size-caption`.
- CTA: `Button fullWidth`. It's **`primary` only on the highlighted card**, `secondary` otherwise, so there's still one primary action per view.

---

## 8. Composition patterns (with placeholder copy)

**Question step** (the core screen):

```tsx
function QuestionStep() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <StepLayout
      brand="Your logo"
      top={<ProgressStepper current={2} total={5} />}
      footer={<><Button variant="secondary">Back</Button><Button disabled={!value.length}>Continue</Button></>}
    >
      <h1 className="tb-h1">Ask one clear question per page</h1>
      <p className="tb-caption">Choose all that apply</p>
      <ChipGroup label="Ask one clear question per page" options={['Option A', 'Option B', 'Option C', 'Option D']} value={value} onChange={setValue} />
    </StepLayout>
  );
}
```

**Review step with optional extras:** `StepLayout` with `ProgressStepper variant="sections" sections={['Details','Extras','Review']} activeIndex={1}`, a `tb-h2` heading, and an `AddOnCard title="Optional"` holding `AddOnItem`s with prices. Footer: Back (secondary) + Continue (primary).

**Result behind a sign-in gate:** `GatedContent locked gate={<Modal open title="Create an account to see your results">…TextInput(email), TextInput(password), Button fullWidth…</Modal>}` wrapping a `StepLayout` that shows the result: a `tb-h1` plus `Tabs` containing `GroupedList`s.

**Pricing:** a `StepLayout` with a `tb-h1` and a responsive grid of `PricingCard`s (`repeat(auto-fit, minmax(170px, 1fr))`, gap `space-4`). Exactly one is `highlighted` with a badge.

**Loading/analysis step:** `PercentLoader` driven by `useSimulatedProgress(messages, 15000, onDone)`, optionally with an `AssistantMessage` below.

---

## 9. Design rules

- **One primary (blue) action per view**; all other actions use `variant="secondary"`.
- **Build every step page with `StepLayout`.** Content stays in the 576px column; spacing in 4px steps (`--tb-space-*`).
- **Headings** use `tb-h1` / `tb-h2` (display serif); **body copy** uses `tb-body` and `tb-caption`.
- **Selection:** chips for short options (`ChipGroup`); `SelectionCardGroup` when options need a description; `AutocompleteInput` for long lists.
- **Accessibility:** pass `label` to every input and group (use `hideLabel` when the page heading already asks the question). Keep the roles: `checkbox`/`radio` chips, `radiogroup`, `combobox`/`listbox`, `tablist`/`tab`/`tabpanel`, `dialog`, `progressbar`, `region`. Every interactive element gets a visible keyboard focus ring.
- **Never hard-code colours, font sizes, radii or shadows** in components or apps. Use the CSS variables or the `tb-` Tailwind utilities.
- **Don't** add a provider, a dark theme, font files, or another component library for anything this system covers.

---

## 10. States the system doesn't define (how to fill gaps)

The source design didn't specify these. If needed, build them **only from existing tokens** and introduce **no new colours**:

| Gap | Guidance |
|---|---|
| Button active/pressed | Keep `action-primary-hover-bg`; optionally `transform: translateY(1px)`. |
| Button loading | Keep the label width; replace or append a `tb-assistant__dots`-style indicator; set `aria-busy` and `disabled`. |
| Chip hover / disabled | Hover: border `border-card`. Disabled: 50% opacity, `not-allowed` cursor. |
| Error colour | `feedback-error` (neutral grey placeholder). Pair it with clear text, never colour alone. |
| Dark mode | Not part of the system. |

---

## 11. Acceptance checklist

- [ ] `tokens.css` matches §4.1 exactly (values and names).
- [ ] Every component in §7 exists with exactly the listed props and defaults. Nothing renders copy that didn't come from props (except the documented accessibility fallbacks: `'Dismiss'`, `'Announcement'`, `'Close'`, `'Add'`, `'Remove'`, `'Skip'`, `'Loading'`, `'Progress'`, `'Step x of y'`).
- [ ] Buttons, chips, inputs and the chip free-text field are **pill-shaped**. Cards are 16px-rounded. The modal and banner are square.
- [ ] Selected chips and cards are **bold with the blue-tinted lift shadow and no visible border**. The selected card's radio shows a 5px blue ring.
- [ ] Disabled buttons are 30% blue with white text.
- [ ] `className="mt-6 rounded-none"` on a `Button` overrides its radius (component CSS loses to utilities).
- [ ] Keyboard: chips and cards toggle with Space/Enter; selection cards and tabs move with the arrow keys; the autocomplete supports ↑/↓/Enter/Escape; Modal focuses its first field and closes on Escape.
- [ ] `prefers-reduced-motion` stops the thinking dots.
- [ ] Works on React 18 and 19 (no `inert` JSX prop, no React-19-only APIs).
- [ ] With the layered stylesheet on, `StepLayout` shows the bottom blue glow, a header hairline and a sticky translucent footer, and focused inputs get the pink → violet → blue ring. `<html data-tb-depth="flat">` turns it all off.

---

## 12. Suggested build sequence (prompts for the platform)

Paste this whole document as project knowledge or custom instructions, then build in steps, checking the preview after each:

1. **Tokens and foundation.** "Create `src/styles/tokens.css` exactly as in §4.1, `foundation.css` as in §4.4, the Tailwind mapping as in §5 and the CSS entry. Then a page that renders swatches for every colour token, the type scale (`tb-h1` … `tb-caption`), the spacing scale and the radii."
2. **Actions and layout.** "Build `Button`, `ProgressStepper` and `StepLayout` per §7.1–7.3. Show the Question-step pattern from §8 with placeholder copy."
3. **Selection.** "Build `SelectionChip`/`ChipGroup` and `SelectionCardGroup` per §7.4–7.5, including the keyboard behaviour and the selected state (bold + lift shadow, no border)."
4. **Inputs.** "Build `TextInput` and `AutocompleteInput` per §7.6–7.7 (combobox ARIA, value only set by choosing)."
5. **Content blocks.** "Build `PromoBanner`, `InfoDrawer`, `AddOnCard`/`AddOnItem` and `PricingCard` per §7.8–7.10 and §7.15."
6. **Feedback and overlays.** "Build `PercentLoader` + `useSimulatedProgress`, `AssistantMessage`, `Modal` + `GatedContent`, and `Tabs` + `GroupedList` per §7.11–7.14."
7. **Layered look.** "Add the optional depth stylesheet from §6 and a toggle on the showcase that sets `data-tb-depth` on `<html>`."
8. **Showcase and review.** "Make a showcase page that renders every component and the four patterns in §8. Then go through the acceptance checklist in §11 and fix anything that doesn't match."
