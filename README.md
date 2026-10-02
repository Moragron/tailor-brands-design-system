# tailor-brands-design-system

A **Lovable design system**: design tokens + content-free React components, whose visual language was measured from a production website (tailorbrands.com). Connect it to a Lovable project and the project gets the look; you bring every word.

- **Tokens:** colour, type, spacing, radii, shadows, effects, breakpoints and layout. 67 of 72 were measured from the live site; 5 are neutral placeholders.
- **15 components, no built-in copy:** buttons, chips, selection cards, inputs, autocomplete, banners, add-on lists, disclosures, a progress loader, a modal with a blurred gate, tabs, pricing cards, and a step layout.
- **Works with** Tailwind 4 or Tailwind 3 (preset included), React 18 or 19, and Lovable's default shadcn/ui setup (its theme variables are mapped to the tokens). No provider or wrapper.

## How it works in Lovable

This repo is the source of a **local-source design system project** in Lovable (no npm package). On **Release version**, Lovable reads the tokens from `src/styles/tokens.css` and the components from the `src/index.ts` barrel, and renders its knowledge files next to the hand-written [`.lovable/system.md`](.lovable/system.md). When a project connects, Lovable copies:

| From this repo | To the connected project |
|---|---|
| `src/` (minus the showcase, stories and `.dsignore` entries) | `src/design-system/<slug>/`, imported as `@/design-system/<slug>` |
| `.lovable/` (`system.md` + generated rules) | `.lovable/rules/libraries/<slug>/` |

[`.lovable/system.md`](.lovable/system.md) is the full guide the Lovable agent follows: setup for Tailwind 4 and 3, the look, tokens, every component and its props, design rules and the "don't" list.

### The Lovable project and the sync

The Lovable design-system project is **`Tailor Brands`**, synced with GitHub [`Moragron/tailor-brands-home-assignment`](https://github.com/Moragron/tailor-brands-home-assignment). Lovable created that repository from its TanStack "custom design system" template, whose preview tooling (`mockupPreviewPlugin.ts`, the `__component` / `__mockup` preview routes, `.lovable/meta.yaml`) must stay in place, so the two repositories are kept in sync rather than one replacing the other:

- **This repository is the source of truth.** Make design-system changes here (PR + CHANGELOG as usual).
- **`npm run lovable:sync -- <path-to-lovable-checkout>`** copies the paths the design system owns into the Lovable checkout: `src/index.ts`, `src/components/` (without stories), `src/styles/`, `src/pages/Showcase.tsx`, `tokens/*.json`, `scripts/build-tokens-css.mjs`, `.lovable/system.md`, `.dsignore`, and a generated `src/styles.css` (the Lovable project's stylesheet). It never touches Lovable's template files, and anything edited in Lovable inside those paths is overwritten.
- Then, in the Lovable checkout: `bun install && bunx tsc --noEmit && bun run build`, commit, push to `main`. Lovable picks up the push; select **Release version** to ship it to connected projects.

One-time template changes already made in the Lovable repository (not part of the sync): Tailwind 4 via `@tailwindcss/vite`, the showcase on the home route (`src/routes/index.tsx`), the page title, `<html data-tb-depth="flat">` in `src/routes/__root.tsx`, and a `tokens:css` script.

Connect projects via **Project settings → General → Design system** (or pick it when creating a project). Lovable copies the files, merges dependencies and verifies the CSS wiring.

## The look

White pages with a 576px content column. Black headings in a condensed display serif; grey `#727585` body text in a clean sans. Pill-shaped buttons, chips and inputs. Primary actions in bright blue `#166cff` (hover `#155cba`, disabled at 30% opacity). Selected options go bold and lift on a soft blue-tinted shadow instead of a border. Overlays are white at 85% with a 12px backdrop blur. Warm-yellow `#ffd272` highlight banners. Spacing on a 4px grid.

**Flat by default, layered on request.** The measured captures have no page gradient, so flat is the default. The depth entry (`styles/depth.css`, or `styles/tw3/depth.css`) is an opt-in layer for the questionnaire look: a soft blue glow rising from the bottom of the page, a translucent sticky action bar and a gradient ring on the active input. The showcase and Storybook can switch between the two.

**Fonts are licensed and not bundled.** The tokens name Proxima Nova (text) and Memories (headings), then fall back to Helvetica/Arial and Georgia.

## Style entry points (`src/styles/`)

| File | Contents |
|---|---|
| `index.css` | **Tailwind 4 entry:** tokens (theme layer), component styles (components layer), token utilities (`bg-tb-*`, `text-tb-*`, `rounded-tb-*`, `shadow-tb-*`, `font-tb-*`, `leading-tb-*`) |
| `tw3/index.css` + `tw3/preset.ts` | **Tailwind 3 entry:** tokens and component styles as plain CSS, plus a preset with the same utility names |
| `shadcn.css` / `tw3/shadcn.css` | Optional: shadcn/ui theme variables pointed at the tokens |
| `base.css` | Optional `<body>` defaults |
| `depth.css` / `tw3/depth.css` | Optional layered questionnaire look |
| `tokens.css`, `theme.css` | Generated from `tokens/tokens.json` (don't edit) |

## Repository layout

| Path | What |
|---|---|
| `src/index.ts`, `src/components/`, `src/styles/` | The design system: everything Lovable copies into connected projects |
| `src/main.tsx`, `src/App.tsx`, `src/pages/` | Showcase app for Lovable's preview (not copied) |
| `.lovable/system.md` | Hand-written agent guide (Lovable never overwrites it); also the canonical component reference for Claude |
| `CLAUDE.md`, `.claude/skills/` | Claude layer: repo guide for Claude Code, and skills to change the system (`tb-ds-change`), publish a preview (`tb-ds-preview`) and build UI with it (`tb-ds-build-ui`) |
| `scripts/build-preview.mjs` | `npm run preview:build`: the showcase as a shareable preview page (claude.ai Artifact) |
| `.dsignore` | Extra exclusions from the copy (Storybook-only folders, Lovable template plumbing) |
| `scripts/sync-lovable.mjs` | Copies the design system into the Lovable project's repository (see above) |
| `tokens/` | `tokens.json` (source of truth) and `tokens.base.json` (derivation rules + placeholders) |
| `scripts/build-tokens-css.mjs` | Generates the token files in `src/styles/` |
| `research/` | **Not part of the design system.** How the tokens were measured: capture pipeline, screenshots, notes, and a prototype of the source site's flow. See [`research/README.md`](research/README.md). |

## Development

```bash
npm install
npm run dev              # showcase, http://localhost:8080
npm run build            # showcase production build (what Lovable's preview builds)
npm run typecheck
npm run tokens:css       # after editing tokens/tokens.json
npm run storybook        # http://localhost:6006
npm run preview:build    # showcase as a shareable preview → preview-dist/ (published as a claude.ai Artifact)
```

Rules for changing the system are at the end of [`.lovable/system.md`](.lovable/system.md): keep imports inside `src/` relative, register new component CSS in `src/styles/components.css`, never hand-edit generated token files.

To re-measure the tokens from the live site, see `research/README.md` (`npm run research:capture && npm run research:tokens`).

**Every PR** adds an entry to [`CHANGELOG.md`](CHANGELOG.md) (what changed and the restore point, i.e. the `main` commit before it) and bumps `version` in `package.json`.

CI (`.github/workflows/ci.yml`) typechecks, checks the generated token files are up to date, builds the showcase and both Storybooks, and runs the token pipeline self-test. `storybook-pages.yml` publishes the design-system Storybook to GitHub Pages.
