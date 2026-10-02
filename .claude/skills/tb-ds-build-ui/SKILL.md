---
name: tb-ds-build-ui
description: Build screens, flows or prototypes in the Tailor Brands look using this design system's components and tokens, in Claude (Claude Code or an Artifact) rather than Lovable. Use when asked to design or build a page, step, questionnaire, pricing view or any UI "in the Tailor Brands style" or "with the design system".
---

# Build UI with the Tailor Brands design system

**Read `.lovable/system.md` first.** It is the complete, canonical reference: setup, the look, every token and utility, every component with its props, design rules and the "don't" list. The same rules apply in Claude as in Lovable. Use only what it lists; if a component or prop isn't there, it doesn't exist.

## Where the UI lives

- **Inside this repo (exploration, demos):** import from `src/index.ts` with relative paths and build in the showcase or a story. Never put product copy into `src/components/`.
- **In another React project:** copy `src/` (minus `main.tsx`, `App.tsx`, `pages/`, `tokens/`, `patterns/` and `*.stories.tsx`) to `src/design-system/tailor-brands/` and follow the Setup section of `system.md` for the project's Tailwind version. Import from the folder root only.
- **As a shareable prototype:** build the screen as a page in the showcase (or a dedicated entry), then publish it with the `tb-ds-preview` skill flow.

## Checklist before showing anything

- Every questionnaire step uses `StepLayout`; one primary action per view.
- Every string comes from the screen being built; components have no built-in copy.
- Every input and group has a `label` (`hideLabel` when a heading already says it).
- Colours, sizes, radii, shadows and spacing come from tokens (`tb-` utilities or `var(--tb-…)`), never hex or px.
- No font files or web-font links; the fallbacks apply.
- No dark-mode styling for design-system components.
- Need a component the system lacks? Build it from tokens in the screen, and suggest adding it to the system (skill `tb-ds-change`) rather than editing `src/components/` on the side.
