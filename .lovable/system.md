# Tailor Brands design system

A **visual language**: design tokens plus content-free React components. It contains no product copy. Every label, heading, option and message comes from the app being built.

Only use the components, props and tokens listed here and in the generated rules (`components.md`, `design-tokens.md`). If something isn't listed, it doesn't exist; don't invent it.

## Where things are

In a connected project this design system lives in `src/design-system/<slug>/` (the folder this file was copied next to is `.lovable/rules/libraries/<slug>/`). Don't edit files there: they're replaced on every design-system update.

- Components: `import { Button, StepLayout } from '@/design-system/<slug>'` (always the folder root, never deep paths into `components/`).
- Styles: `src/design-system/<slug>/styles/` (CSS entry points below).

No provider, theme wrapper or context is needed. Components work on React 18 and 19, with no runtime dependencies besides React.

## Setup (once per project)

Styles are **not** imported from JavaScript. Import one CSS entry in the project's global stylesheet (the CSS file the app entry imports, usually `src/index.css`), matching the project's Tailwind version.

### Tailwind 4 (`@import "tailwindcss"` in the global CSS)

```css
@import "tailwindcss";
@import "./design-system/<slug>/styles/index.css";   /* required: tokens, component styles, token utilities */
@import "./design-system/<slug>/styles/shadcn.css";  /* recommended: points shadcn/ui theme variables at the tokens */
@import "./design-system/<slug>/styles/base.css";    /* optional: page defaults on <body> */
@import "./design-system/<slug>/styles/depth.css";   /* optional: layered questionnaire look (see Depth) */
```

### Tailwind 3 (`@tailwind base;` directives and a `tailwind.config.ts`)

```css
/* top of src/index.css, before the @tailwind directives */
@import "./design-system/<slug>/styles/tw3/index.css";   /* required */
@import "./design-system/<slug>/styles/tw3/shadcn.css";  /* recommended */
@import "./design-system/<slug>/styles/base.css";        /* optional */
@import "./design-system/<slug>/styles/tw3/depth.css";   /* optional */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// tailwind.config.ts — add the preset (same utility names as Tailwind 4)
import tbPreset from './src/design-system/<slug>/styles/tw3/preset';
export default { presets: [tbPreset], /* …existing config… */ };
```

Notes:
- Keep exactly one of the two sets. Don't mix Tailwind 3 and 4 entries, and don't install the other Tailwind version.
- Tailwind utilities passed via `className` (e.g. `mt-6`, `w-full`) override component styles; preflight never breaks them.
- The shadcn bridge outranks the project's own `:root` shadcn variables, so leave the existing shadcn block in place. The design system has no dark theme: don't add dark-mode styling for its components.
- **Fonts:** the tokens name licensed fonts (Proxima Nova for text, Memories for headings) followed by fallbacks (Helvetica/Arial, Georgia). No font files are included. Don't add or load them (no Google Fonts substitutes either); the fallbacks apply automatically.

## The look

White pages with a 576px content column, black headings in a condensed display serif, grey (`#727585`) body text in a clean sans. Pill-shaped buttons, chips and inputs. Primary actions are bright blue `#166cff` (hover `#155cba`, disabled at 30% opacity). Selected options are bold and lifted by a soft blue-tinted shadow, not a border. Overlays are white at 85% with a 12px backdrop blur. Highlight banners are warm yellow `#ffd272`.

The hex values above describe the look; in code always use tokens.

## Tokens

Measured from a production website: 67 of 72 values are real; 5 are neutral placeholders (muted surface, solid badge background, error colour, `h3` size, page gradient).

**Never hard-code colours, font sizes, radii or shadows.** Use tokens:
- **CSS variables:** `var(--tb-color-action-primary-bg)`, `var(--tb-space-4)`, `var(--tb-radius-card)`. Full list: `styles/tokens.css`.
- **Tailwind utilities** (identical on Tailwind 3 and 4):

  | Need | Utility |
  |---|---|
  | Colour | `bg-tb-surface-card`, `text-tb-text-muted`, `border-tb-border-card`, `bg-tb-action-primary-bg`, `bg-tb-banner-bg` |
  | Type | size `text-tb-h1` … `text-tb-caption` · family `font-tb-base`, `font-tb-heading` · weight `font-tb-h1`, `font-tb-button` · line height `leading-tb-body` |
  | Radius / shadow | `rounded-tb-button`, `rounded-tb-chip`, `rounded-tb-card`, `shadow-tb-chip-selected` |
  | Spacing | CSS variables only, base unit 4px: `p-(--tb-space-4)`, `gap-(--tb-space-2)` on Tailwind 4; `p-[var(--tb-space-4)]`, `gap-[var(--tb-space-2)]` on Tailwind 3 |

- **Typography classes:** `tb-h1`, `tb-h2`, `tb-h3`, `tb-body`, `tb-caption`.
- shadcn/ui utilities (`bg-primary`, `text-muted-foreground`, `border-border`) resolve to the tokens through the shadcn bridge, but prefer the `tb-` utilities in new code.

### Depth (optional layered look)

The measured look is **flat**. For the layered questionnaire look (white page with a soft blue glow rising from the bottom, translucent sticky action bar, gradient ring on the active input), import the depth entry (see Setup). It changes no component API:

- `StepLayout`: page glow (`--tb-effect-page-gradient`, also on `<body>` via `base.css`), a hairline under the header, and the `footer` becomes a sticky, translucent, blurred action bar with a divider. **Build every questionnaire step with `StepLayout`** so it gets this automatically; don't recreate the background yourself.
- Inputs (`TextInput`, `AutocompleteInput`, the `ChipGroup` free-text field): a pink → violet → blue gradient ring and faint blue fill when focused, and on `AutocompleteInput` once a value is picked.
- Colours for your own elements: `bg-tb-glow`, `border-tb-divider`.
- Gradients for your own elements: `bg-(image:--tb-effect-page-gradient)` (Tailwind 3: `bg-[image:var(--tb-effect-page-gradient)]`) for a page not using `StepLayout`; `--tb-effect-section-gradient` for a band fading into the glow; `--tb-effect-accent-gradient` for an accent ring or line (use sparingly).
- Opt a page back out with `<html data-tb-depth="flat">`.

Only use these utilities and variables when the depth entry is imported.

## Components

All are named exports from `@/design-system/<slug>`. None has built-in copy: pass every visible string.

| Component | Use for | Key props |
|---|---|---|
| `StepLayout` | Page shell: header, centred 576px column, action row | `brand`, `top`, `banner`, `footer`, `children` |
| `Button` | Every action | `variant="primary" \| "secondary"`, `fullWidth`, native button props |
| `ProgressStepper` | Progress in a multi-step experience | `current`, `total` · or `variant="sections"`, `sections`, `activeIndex` |
| `ChipGroup` / `SelectionChip` | Short options, multi- (default) or single-select | `label`, `options`, `value: string[]`, `onChange`, `mode`, `freeText={{ value, onChange, placeholder, label }}` |
| `SelectionCardGroup` | Single choice with label + description | `label`, `options: {value,label,description?}[]`, `value`, `onChange` |
| `TextInput` | Text, email, phone, password | `label` (required, even when hidden), `hideLabel`, `helper`, `prefix`, `error`, native input props |
| `AutocompleteInput` | Pick one value from a long list | `label`, `options`, `value: string \| null`, `onChange`, `placeholder` |
| `PromoBanner` | Announcement strip above a header | `children`, `icon`, `onDismiss`, `dismissLabel`, `label`, `sticky` |
| `AddOnCard` + `AddOnItem` | A titled list of optional items | `AddOnCard title`; `AddOnItem title, added, onChange, mode="toggle"\|"choice", price, badge, description, info, addLabel, removeLabel, skipLabel` |
| `InfoDrawer` | Inline "learn more" disclosure | `triggerLabel`, `sections: {heading, body}[]`, `defaultOpen` |
| `PercentLoader` + `useSimulatedProgress` | Determinate progress with a status line | `percent`, `label`, `headline`, `message: {text, source?}`; hook `(messages, durationMs, onDone)` |
| `AssistantMessage` | Conversational message with a loading state | `thinking`, `thinkingLabel`, `children` |
| `Modal` + `GatedContent` | Dialog; content blurred behind a gate | `Modal open, title, onClose?, closeLabel`; `GatedContent locked, gate` |
| `Tabs` + `GroupedList` | Tabbed panels; grouped lists | `tabs: {id,label,content}[]`, `defaultTab`; `GroupedList groups: {heading, items}[]` |
| `PricingCard` | Plan or product comparison | `name`, `price`, `period`, `priceNote`, `badge`, `features`, `ctaLabel`, `onCtaClick`, `highlighted` |

### Example

```tsx
import { useState } from 'react';
import { Button, ChipGroup, ProgressStepper, StepLayout } from '@/design-system/<slug>';

export function InterestsStep({ onNext }: { onNext: (v: string[]) => void }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <StepLayout brand={<YourLogo />} top={<ProgressStepper current={2} total={4} />}
      footer={<Button disabled={!value.length} onClick={() => onNext(value)}>Continue</Button>}>
      <h1 className="tb-h1">What are you interested in?</h1>
      <ChipGroup label="What are you interested in?" options={['Design', 'Engineering', 'Marketing']} value={value} onChange={setValue} />
    </StepLayout>
  );
}
```

## Design rules

- One primary (blue) action per view; secondary actions use `variant="secondary"`.
- Generous whitespace: content in the 576px column, spacing in 4px steps (`--tb-space-*`).
- Headings use `tb-h1`/`tb-h2` (display serif); body copy uses `tb-body` and `tb-caption`.
- Selection: chips for short options, `SelectionCardGroup` when options need a description.
- Accessibility: pass `label` to every input and group (`hideLabel` when a heading already says it). Keep the provided roles (`checkbox`/`radio` chips, `tablist`, `dialog`, `progressbar`).
- States the system doesn't define (loading buttons, error colour): build them from tokens; don't introduce new colours.

## Don't

- Don't use shadcn/ui (`@/components/ui/*`) or other component libraries for anything listed above: buttons, chips/toggles, radio cards, inputs, comboboxes, banners, accordions/disclosures, progress, dialogs, tabs, pricing cards. Use shadcn only for things this system doesn't cover (e.g. tooltips, dropdown menus, toasts), and style them with tokens.
- Don't hard-code hex values or px font sizes, and don't use inline `style` to override components; use tokens and `className`.
- Don't wrap the app in a provider; none exists.
- Don't copy or re-implement design-system components locally, and don't edit files in `src/design-system/<slug>/`. Propose changes in the design-system project instead.
- Don't add font files or web-font links.

## Maintaining this design system (design-system project only)

Ignore this section in connected projects.

- `src/` is what ships: `src/index.ts` (barrel, the component catalog), `src/components/*`, `src/styles/*`. Keep every import inside `src/` **relative** (no `@/` alias); the folder is relocated to `src/design-system/<slug>/` on attach.
- Components don't import CSS. Each component's `.css` is listed in `src/styles/components.css`; add new components there and to `src/index.ts`. Component CSS is plain (no `@layer`, no `@theme`): the entry files apply the cascade layer.
- Tokens: edit `tokens/tokens.json`, then run `npm run tokens:css`. It regenerates `src/styles/tokens.css`, `theme.css`, `shadcn.css`, `tw3/preset.ts` and `tw3/shadcn.css`. Never edit those by hand.
- The showcase (`src/App.tsx`, `src/pages/`) and Storybook stories are previews only and are not copied to connected projects. Use placeholder copy there.
- Ignore the `research/` folder: it holds the analysis that produced the tokens (captures, notes, a prototype). Never copy its text, screens or flows into components, the showcase or an app.
