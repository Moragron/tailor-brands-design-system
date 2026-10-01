# Importing into v0 (Design Systems 2.0)

How to turn this repo into a v0 design system skill. v0 reads the sources, builds a starter app, and saves the skill only after you approve it. Every future chat starts from that starter, so get it right once.

## Before you import

1. **Check the token status.** `tokens/tokens.json` → `$meta.status`. As of 1 Oct 2026, 67 of 72 tokens are measured from the live onboarding; the 5 left have no counterpart in the flow (README → *Known gaps*). Re-importing later works, but existing v0 projects don't update automatically.
2. **Make the repo readable by v0.** Either connect GitHub in v0 with access to `Moragron/tailor-brands-design-system`, or make the repo public.
3. **Merge to `main`** (v0 reference sources pin a branch/ref), and let CI go green.
4. **Publish Storybook** (optional, but v0 accepts it as a link). Enable GitHub Pages → *Source: GitHub Actions*. The `storybook-pages` workflow deploys it on every push to `main`.
5. **Have a `.tgz` ready if v0 can't install from GitHub:** `npm pack` produces `tailor-brands-design-system-<version>.tgz`; attach it in the import form.

## Import form

| Field | Value |
|---|---|
| GitHub repository | `Moragron/tailor-brands-design-system` @ `main`: contains the package source **and** the consumer app `examples/next-app` |
| Links | Storybook URL from GitHub Pages (after step 4) |
| Attachments | the `.tgz` from step 5 (only if needed), and a few screenshots from `reference/screenshots/` once captured |
| Figma | none (no Figma file exists; the system was reverse-engineered from the live site) |

## Notes to paste

```text
Package: tailor-brands-design-system (React ≥18, Next.js App Router, Tailwind v4). Install: npm install github:Moragron/tailor-brands-design-system (the prepare script builds dist/) or the attached .tgz.

Required global CSS, in app/globals.css, in this order:
  @import 'tailwindcss';
  @import 'tailor-brands-design-system/styles.css';
  @import 'tailor-brands-design-system/tailwind.css';
  @import 'tailor-brands-design-system/base.css';   (optional body defaults)
No provider or theme wrapper is needed. Fonts are Tailor Brands' licensed Proxima Nova / Memories, referenced with fallbacks and not bundled; don't add them unless licensed. Do not also import the CSS from JS.

Read AGENTS.md at the repo root first: it lists every component, prop and token that is safe to use. The reference consumer app is examples/next-app (app/globals.css, app/layout.tsx, app/customers-step.tsx).

Every export is a client component ('use client' is in the bundle). Keep answer state in a small 'use client' step component; pages can stay server components.

Use tokens, never hard-coded values: CSS variables var(--tb-*) or the Tailwind utilities bg-tb-*, text-tb-*, border-tb-*, rounded-tb-*, shadow-tb-*, font-tb-*, leading-tb-*. Spacing is CSS variables only: p-(--tb-space-4).

Screens use FlowLayout (top = ProgressStepper, footer = Button "Next", banner = PromoBanner) with a tb-h1 heading. Disable Next until the answer is valid.

Do not add shadcn/ui components for anything the package covers (buttons, chips, inputs, cards, modal, tabs). Do not use src/screens/ or "[copy not captured]" placeholders — they are research artifacts. Do not set RegistrationModal's legalCtaLabel. Render user-entered business names verbatim.
```

## Reviewing the starter v0 builds

Check the following before approving:

- `globals.css` has the three imports **in order** and no duplicate CSS import in `layout.tsx`.
- `components.json` / shadcn components haven't been generated for things this package already provides.
- A sample screen uses `FlowLayout` + `ProgressStepper` + `Button`, and Next is disabled until answered.
- There are no hex colors or px font sizes in the generated code; everything goes through `--tb-*` / `*-tb-*`.
- It builds without "useState only works in Client Components" errors.

## Keeping the skill current

When tokens are re-captured or components change, bump `version` in `package.json`, push to `main`, and tell v0 in any chat, for example: *"Update the Tailor Brands design system to 0.2.0: tokens re-captured from the live site (see tokens/tokens.json $meta), new prop X on Y."* v0 re-verifies the starter and records it in Revision History. Existing v0 apps need to be asked to update explicitly.
