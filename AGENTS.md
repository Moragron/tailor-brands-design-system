# AGENTS.md — using `tailor-brands-design-system`

Instructions for AI coding agents (v0, Claude Code, Cursor, …) building UI with this design system. The package is a React component library plus design tokens for the Tailor Brands onboarding flow. Only use components, props and tokens listed here or exported from `src/index.ts`. If something isn't listed, it doesn't exist; don't invent it.

## Stack

React ≥18 (tested with 19), Next.js App Router, Tailwind CSS v4. There is no provider, theme wrapper or context, and no web font to load.

## Install

```bash
npm install github:Moragron/tailor-brands-design-system   # builds dist/ via the prepare script
# or: attach the packed archive from `npm pack` (tailor-brands-design-system-<version>.tgz)
```

## Setup (required, once per app)

In the global stylesheet (`app/globals.css`), **in this order**:

```css
@import 'tailwindcss';
@import 'tailor-brands-design-system/styles.css';   /* tokens + component styles (@layer components) */
@import 'tailor-brands-design-system/tailwind.css'; /* token utilities: bg-tb-*, text-tb-*, rounded-tb-*, shadow-tb-* */
@import 'tailor-brands-design-system/base.css';     /* optional: Tailor-branded <body> defaults */
```

- Don't import the CSS from JavaScript as well: it's already in `globals.css`.
- The component CSS lives in `@layer components`, so Tailwind utilities passed via `className` (e.g. `mt-6`) override it, and Tailwind preflight never breaks it.
- The JS bundle starts with `'use client'`, so every export is a client component. Server components can render them directly. Put `useState` answer state in your own `'use client'` file (see `examples/next-app/app/customers-step.tsx`).

## Tokens

- **Status: PLACEHOLDER.** Check `tokens/tokens.json` → `$meta.status`. Until a live capture runs, values are neutral grays, not Tailor Brands' real palette. Build with the tokens anyway: re-capturing restyles everything automatically.
- **Never hard-code colors, font sizes, radii or shadows.** Use tokens:
  - CSS variables: `var(--tb-color-action-primary-bg)`, `var(--tb-space-4)`, `var(--tb-radius-card)`. The full list is in `tokens/tokens.css`.
  - Tailwind utilities (v4, generated in `tokens/tailwind.css`):

    | Need | Utility |
    |---|---|
    | Color | `bg-tb-surface-card`, `text-tb-text-muted`, `border-tb-border-card`, `bg-tb-action-primary-bg` |
    | Type | size `text-tb-h1` … `text-tb-caption` · family `font-tb-base`, `font-tb-heading` · weight `font-tb-h1`, `font-tb-button` · line height `leading-tb-body` |
    | Radius / shadow | `rounded-tb-card`, `rounded-tb-button`, `shadow-tb-modal` |
    | Spacing | `p-(--tb-space-4)`, `gap-(--tb-space-2)` (spacing tokens are CSS variables only) |

- Typography classes: `tb-h1`, `tb-h2`, `tb-h3`, `tb-body`, `tb-caption`. Use them for page headings and body copy inside `FlowLayout`.

## Components

All components are named exports from `'tailor-brands-design-system'`.

| Component | Use for | Key props |
|---|---|---|
| `FlowLayout` | Page shell of every onboarding screen | `top` (stepper), `banner` (promo), `footer` (CTA row), `brand`, `children` |
| `ProgressStepper` | "1/6" counter on question screens; section nav on recommendation screens | `current`, `total` · or `variant="sections"`, `sections`, `activeIndex` |
| `Button` | Every action | `variant="primary" \| "secondary"`, `fullWidth`, native button props. Primary = Next/Start/Continue/Add; secondary = Skip/Remove/Back |
| `ChipGroup` / `SelectionChip` | Multi- (default) or single-select answers | `label`, `options`, `value: string[]`, `onChange`, `mode`, `freeText={{ value, onChange, placeholder }}` |
| `SelectionCardGroup` | Single-select list with longer labels (e.g. revenue bands) | `label`, `options: {value,label,description?}[]`, `value`, `onChange` |
| `TextInput` | Free text, email, phone, password | `label` (required, even when hidden), `hideLabel`, `helper`, `prefix` (e.g. `"+1"`), `error`, native input props |
| `AutocompleteInput` | Pick one value from a long list | `label`, `options`, `value: string \| null`, `onChange`. `US_STATES` is exported for state pickers |
| `PromoBanner` | Sticky promotional strip above the header | `emoji`, `children`, `onDismiss` (omit = not dismissible), `sticky` |
| `SuiteCard` + `SuiteItem` | Bundle of recommended services | `SuiteCard title`; `SuiteItem title, added, onChange, mode="toggle"\|"choice", badge, price, info` |
| `InfoDrawer` | "What is it" explainer | `sections: {heading, body}[]`, `triggerLabel`, `defaultOpen` |
| `PercentLoader` + `useSimulatedProgress` | Progress with % and rotating status | `percent`, `message: {text, source?}`, `headline`; hook `(messages, durationMs, onDone)` |
| `AssistantMessage` | First-person AI copy, with a "Thinking" state | `thinking`, `children` |
| `Modal` + `GatedContent` | Dialog; content blurred behind a gate | `Modal open, title, onClose?`; `GatedContent locked, gate` |
| `RegistrationModal` | Sign-up gate | `ctaLabel`, `onSubmit`, `googleLabel`. **Don't set `legalCtaLabel`**; it exists only to reproduce a bug |
| `TimelineTabs` + `TimelineList` | Tabbed plan / timeline | `tabs: {id,label,content}[]`, `defaultTab`; `TimelineList groups: {heading, items}[]` |
| `PricingCard` | Plan comparison | `name`, `price`, `period`, `badge`, `features`, `ctaLabel`, `highlighted` |

### Canonical screen

```tsx
'use client';
import { useState } from 'react';
import { Button, ChipGroup, FlowLayout, ProgressStepper } from 'tailor-brands-design-system';

export function ChannelsStep({ onNext }: { onNext: (v: string[]) => void }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FlowLayout top={<ProgressStepper current={5} total={6} />} footer={<Button disabled={!value.length} onClick={() => onNext(value)}>Next</Button>}>
      <h1 className="tb-h1">How do customers get your surf gear and lessons?</h1>
      <ChipGroup label="Channels" options={['In-store pickup', 'Local delivery', 'In-person lessons', 'Online lessons']} value={value} onChange={setValue} />
    </FlowLayout>
  );
}
```

## Conventions

- **One question per screen**, heading in `tb-h1`, CTA bottom-right in `FlowLayout footer`. Disable Next until the answer is valid (the observed pattern).
- **Render user-entered names verbatim.** Never shorten or strip characters: "Swell & Salt Surf Co." stays exactly that.
- **Paid items:** pass `price` to `SuiteItem`, and start `added={false}` unless the product explicitly decides otherwise.
- **Consent is not a feature.** Don't use `SuiteItem` for marketing/SMS consent. Use an unchecked checkbox with its legal copy, shown after the relevant contact field.
- **Legal copy names the real button.** `RegistrationModal` derives it from `ctaLabel`; keep it that way.
- **Accessibility:** always pass `label` to inputs and groups (`hideLabel` when a heading already asks the question). Keep the provided roles (`checkbox`/`radio` chips, `tablist`, `dialog`, `progressbar`).
- **States that aren't defined:** hover, error, loading and empty states were not observed on the live site. Don't style them with made-up colors; use tokens (`--tb-color-feedback-error` is a neutral stand-in).

## Don't

- Don't add shadcn/ui or other component libraries for things listed above.
- Don't hard-code hex values or px font sizes; use tokens.
- Don't wrap the app in a provider; none exists.
- Don't import from `src/` or deep paths. Import from the package root and the CSS entry points listed in `exports`.
- Don't use `[copy not captured]` placeholders or the Storybook-only screens (`src/screens/`) in apps: those are research artifacts.

## Reference

- Storybook: `npm run storybook` (all components, all 14 flow screens, token tables)
- Working consumer app: `examples/next-app`
- Why each token/component exists and what is still unknown: `README.md`, `docs/component-inventory.md`
