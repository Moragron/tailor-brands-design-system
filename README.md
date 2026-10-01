# tailor-brands-design-system

A React design system — **design tokens + content-free components + a Tailwind v4 theme** — whose visual language was measured from a production website (tailorbrands.com). Use it to build your own website or app, for example in **v0**: the package brings the look, you bring every word.

- **Tokens:** colour, type, spacing, radii, shadows, effects, breakpoints and layout. 67 of 72 were measured from the live site; 5 are neutral placeholders.
- **15 components, no built-in copy:** buttons, chips, selection cards, inputs, autocomplete, banners, add-on lists, disclosures, a progress loader, a modal with a blurred gate, tabs, pricing cards, and a step layout.
- **Works with** Next.js App Router + Tailwind v4 (v0's default stack), with no provider or wrapper.

## Quick start

```bash
npm install github:Moragron/tailor-brands-design-system
```

```css
/* app/globals.css — in this order */
@import 'tailwindcss';
@import 'tailor-brands-design-system/styles.css';
@import 'tailor-brands-design-system/tailwind.css';
@import 'tailor-brands-design-system/base.css';   /* optional page defaults */
```

```tsx
import { StepLayout, ProgressStepper, ChipGroup, Button } from 'tailor-brands-design-system';
```

- **[`AGENTS.md`](AGENTS.md):** the full component, prop and token reference and the design rules (also what v0 and other AI agents read).
- **[`examples/next-app`](examples/next-app):** a working Next.js + Tailwind v4 app built only from the package.
- **[`docs/v0-import.md`](docs/v0-import.md):** how to import into v0 Design Systems 2.0, with notes ready to paste.
- **Storybook:** `npm run storybook`, showing tokens, every component and composition patterns.

## The look

White pages with a 576px content column. Black headings in a condensed display serif; grey `#727585` body text in a clean sans. Pill-shaped buttons, chips and inputs. Primary actions in bright blue `#166cff` (hover `#155cba`, disabled at 30% opacity). Selected options go bold and lift on a soft blue-tinted shadow instead of a border. Overlays are white at 85% with a 12px backdrop blur. Warm-yellow `#ffd272` highlight banners. Spacing on a 4px grid.

**Fonts are licensed and not bundled.** The tokens name Proxima Nova (text) and Memories (headings), then fall back to Helvetica/Arial and Georgia. Load the real fonts only if you hold a licence.

## Package entry points

| Entry point | Contents |
|---|---|
| `tailor-brands-design-system` | Components and hooks (`src/index.ts`), ESM with a `'use client'` banner, typed |
| `…/styles.css` | Tokens + all component styles in `@layer components` (Tailwind utilities override; preflight doesn't) |
| `…/tailwind.css` | Tailwind v4 `@theme inline` mapping: `bg-tb-*`, `text-tb-*`, `rounded-tb-*`, `shadow-tb-*`, `font-tb-*`, `leading-tb-*` |
| `…/base.css` | Optional `<body>` defaults |
| `…/tokens.css`, `…/tokens.json` | Raw tokens (CSS variables; JSON with provenance) |

## Repository layout

| Path | What |
|---|---|
| `src/` | Components, foundation styles, Storybook stories and patterns |
| `tokens/` | `tokens.json` (generated, source of truth for apps), `tokens.css`, `tailwind.css`, and `tokens.base.json` (derivation rules + placeholders) |
| `scripts/` | Package build (`build-lib.mjs`) and token CSS generation |
| `examples/next-app` | Reference consumer app |
| `docs/` | v0 import guide |
| `research/` | **Not part of the design system.** How the tokens were measured: capture pipeline, screenshots, notes, and a prototype of the source site's flow. See [`research/README.md`](research/README.md). |

## Development

```bash
npm install              # also builds dist/
npm run storybook        # http://localhost:6006
npm run typecheck
npm run build            # dist/index.js, dist/types, dist/styles.css
npm run example          # clean install + build of examples/next-app
```

To re-measure the tokens from the live site, see `research/README.md` (`npm run research:capture && npm run research:tokens`).

CI (`.github/workflows/ci.yml`) typechecks, builds the package and Storybook, runs the token pipeline self-test and builds the example app. `storybook-pages.yml` publishes the design-system Storybook to GitHub Pages.
