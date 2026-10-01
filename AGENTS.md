# AGENTS.md — building with `tailor-brands-design-system`

Instructions for AI coding agents (v0, Claude Code, Cursor, …) and developers. This package is a **visual language**: design tokens plus content-free React components. It contains no product copy. Every label, heading, option and message comes from the app you're building.

Only use the components, props and tokens listed here (or exported from `src/index.ts`). If something isn't listed, it doesn't exist; don't invent it.

**Ignore the `research/` folder.** It holds the analysis that produced the tokens (captures, notes, a prototype). It is not part of the design system: never copy its text, screens or flows into an app.

## Stack

React ≥18 (tested with 19), Next.js App Router, Tailwind CSS v4. No provider, theme wrapper or context.

**Fonts:** the tokens name licensed fonts (Proxima Nova for text, Memories for headings) followed by fallbacks (Helvetica/Arial, Georgia). The package doesn't ship font files. Don't add them unless the app has a licence; the fallbacks are used automatically.

## Install

```bash
npm install github:Moragron/tailor-brands-design-system   # builds dist/ via the prepare script
# or: the archive from `npm pack` (tailor-brands-design-system-<version>.tgz)
```

## Setup (required, once per app)

In the global stylesheet (`app/globals.css`), **in this order**:

```css
@import 'tailwindcss';
@import 'tailor-brands-design-system/styles.css';   /* tokens + component styles (@layer components) */
@import 'tailor-brands-design-system/tailwind.css'; /* token utilities: bg-tb-*, text-tb-*, rounded-tb-*, shadow-tb-* */
@import 'tailor-brands-design-system/base.css';     /* optional: page defaults on <body> */
```

- Don't also import the CSS from JavaScript.
- Component CSS lives in `@layer components`: Tailwind utilities passed via `className` (e.g. `mt-6`) override it, and Tailwind preflight never breaks it.
- The JS bundle starts with `'use client'`, so every export is a client component. Server components can render them directly; put `useState` in your own small `'use client'` file (see `examples/next-app/app/question-step.tsx`).

## Tokens

Measured from a production website: 67 of 72 values are real (`"$observed": true` in `tokens/tokens.json`); 5 are neutral placeholders (muted surface, solid badge background, error colour, `h3` size, page gradient).

**The look in one paragraph:** white pages with a 576px content column, black headings in a condensed display serif, grey (`#727585`) body text in a clean sans. Pill-shaped buttons, chips and inputs. Primary actions are bright blue `#166cff` (hover `#155cba`, disabled at 30% opacity). Selected options are bold and lifted by a soft blue-tinted shadow, not a border. Overlays are white at 85% with a 12px backdrop blur. Highlight banners are warm yellow `#ffd272`.

**Never hard-code colours, font sizes, radii or shadows.** Use tokens:
- **CSS variables:** `var(--tb-color-action-primary-bg)`, `var(--tb-space-4)`, `var(--tb-radius-card)`. The full list is in `tokens/tokens.css`.
- **Tailwind utilities** (v4, generated in `tokens/tailwind.css`):

  | Need | Utility |
  |---|---|
  | Colour | `bg-tb-surface-card`, `text-tb-text-muted`, `border-tb-border-card`, `bg-tb-action-primary-bg`, `bg-tb-banner-bg` |
  | Type | size `text-tb-h1` … `text-tb-caption` · family `font-tb-base`, `font-tb-heading` · weight `font-tb-h1`, `font-tb-button` · line height `leading-tb-body` |
  | Radius / shadow | `rounded-tb-button`, `rounded-tb-chip`, `rounded-tb-card`, `shadow-tb-chip-selected` |
  | Spacing | `p-(--tb-space-4)`, `gap-(--tb-space-2)` (spacing tokens are CSS variables only; base unit 4px) |

**Typography classes:** `tb-h1`, `tb-h2`, `tb-h3`, `tb-body`, `tb-caption`.

## Components

All are named exports from `'tailor-brands-design-system'`. None has built-in copy: pass every visible string.

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
'use client';
import { useState } from 'react';
import { Button, ChipGroup, ProgressStepper, StepLayout } from 'tailor-brands-design-system';

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

- Don't add shadcn/ui or other component libraries for things listed above.
- Don't hard-code hex values or px font sizes; use tokens.
- Don't wrap the app in a provider; none exists.
- Don't import from `src/` or deep paths. Use the package root and the CSS entry points in `exports`.
- Don't use anything from `research/`.

## Reference

- Storybook: `npm run storybook` (tokens, every component, composition patterns)
- Working consumer app: `examples/next-app`
