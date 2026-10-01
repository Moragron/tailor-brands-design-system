# Importing into v0 (Design Systems 2.0)

How to turn this repo into a v0 design system skill. v0 reads the sources, builds a starter app, and saves the skill only after you approve it. Every future chat starts from that starter, so get it right once.

The skill should teach v0 the **look and the components only**. The repo's `research/` folder (the analysis of the source website) isn't part of the design system, and the notes below tell v0 to ignore it.

## Before you import

1. **Merge to `main` and let CI go green.** v0 reference sources pin a branch.
2. **Make the repo readable by v0.** Connect GitHub in v0 with access to `Moragron/tailor-brands-design-system` (works for private repos), or keep the repo public.
3. **Publish Storybook (optional, but v0 accepts the link).** In the repo's Settings → Pages, set Source to *GitHub Actions*. The `storybook-pages` workflow deploys the design-system Storybook on every push to `main`. It contains only tokens, components and neutral patterns.
4. **Have a `.tgz` ready in case v0 can't install from GitHub:** `npm pack` produces `tailor-brands-design-system-<version>.tgz`; attach it in the import form.

## Import form

| Field | Value |
|---|---|
| GitHub repository | `Moragron/tailor-brands-design-system` @ `main` (package source + the consumer app `examples/next-app`) |
| Links | The Storybook URL from GitHub Pages (after step 3) |
| Attachments | The `.tgz` from step 4, only if needed |
| Figma | None |

## Notes to paste

```text
Design system: tailor-brands-design-system — design tokens + content-free React components + a Tailwind v4 theme. It provides the LOOK only; all copy (headings, labels, options, messages) comes from the app being built.

IGNORE the research/ folder entirely: it documents how the tokens were measured from another website and must never be used as content, copy, flows or screens.

Install: npm install github:Moragron/tailor-brands-design-system (the prepare script builds dist/), or the attached .tgz.

Required global CSS, in app/globals.css, in this order:
  @import 'tailwindcss';
  @import 'tailor-brands-design-system/styles.css';
  @import 'tailor-brands-design-system/tailwind.css';
  @import 'tailor-brands-design-system/base.css';   (optional body defaults)
  @import 'tailor-brands-design-system/depth.css';  (optional layered look: shadows + page gradient; include it if pages should not look flat)
No provider or theme wrapper. Don't also import the CSS from JS. Fonts (Proxima Nova, Memories) are licensed and not bundled; the tokens fall back to Helvetica/Arial and Georgia, so don't add font files.

Read AGENTS.md at the repo root first: it lists every component, prop and token that is safe to use, and the design rules. The reference consumer app is examples/next-app (app/globals.css, app/layout.tsx, app/question-step.tsx).

Every export is a client component ('use client' is in the bundle). Keep interactive state in small 'use client' components; pages can stay server components.

Use tokens, never hard-coded values: CSS variables var(--tb-*) or the Tailwind utilities bg-tb-*, text-tb-*, border-tb-*, rounded-tb-*, shadow-tb-*, font-tb-*, leading-tb-*. Spacing is CSS variables only: p-(--tb-space-4).

Look: white pages, 576px content column (StepLayout), display-serif headings (tb-h1/tb-h2), grey sans body text, pill buttons/chips/inputs, one bright-blue primary action per view.

Depth: the default look is flat. With depth.css imported, build every questionnaire step with StepLayout: it adds the bottom blue page glow, the header hairline and the sticky translucent action bar, and inputs get the gradient ring. Don't recreate those by hand. For other pages, layer as page gradient (bg-(image:--tb-effect-page-gradient)) -> white cards (bg-tb-surface-card rounded-tb-card shadow-tb-raised) -> floating layers (shadow-tb-floating); bands use bg-(image:--tb-effect-section-gradient). See "Depth" in AGENTS.md.

Do not add shadcn/ui components for anything the package covers (buttons, chips, inputs, selection cards, modal, tabs, pricing cards).
```

## Reviewing the starter v0 builds

Check the following before approving:

- `globals.css` has the imports **in order**, with no duplicate CSS import in `layout.tsx`.
- No shadcn components were generated for things this package already provides.
- The sample screen uses package components (e.g. `StepLayout` + `Button`) **with neutral or your own copy**, and nothing from `research/`.
- The generated code has no hex colours or px font sizes; everything goes through `--tb-*` / `*-tb-*`.
- It builds without "useState only works in Client Components" errors.

## Keeping the skill current

When tokens or components change, bump `version` in `package.json`, push to `main`, and tell v0 in any chat, for example: *"Update the design system to 0.3.0: new prop X on Y; tokens re-measured (see tokens/tokens.json $meta)."* v0 re-checks the starter and records it in Revision History. Existing v0 apps need to be asked to update explicitly.
