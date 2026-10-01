# Changelog

One entry per merged pull request, newest first. Each entry records the **restore point**: the `main` commit just before the PR was merged. If a change makes things worse, you can go back in one of three ways.

## How to go back

1. **Undo one PR (recommended).** Open the merged PR on GitHub and click **Revert**. GitHub opens a new PR that undoes exactly that change, and later PRs stay in place. Merge it like any other PR.
2. **Ship the revert to connected Lovable projects.** After the revert is on the branch the Lovable design-system project syncs with, open that project and select **Release version**. Connected projects see **Update available** in their chat; accepting it replaces their `src/design-system/<slug>/` copy. A project that doesn't accept the update keeps the version it was attached at.
3. **From the command line** (undo a merged PR on a new branch, then open a PR from it):
   ```bash
   git revert -m 1 <merge-commit-sha>
   ```
   The merge commit SHA is shown at the bottom of the merged PR ("merged commit …").

Each PR also bumps `version` in `package.json`. Lovable keeps its own release number per **Release version**; connected projects record it in `lovable.toml`.

---

## 0.3.0: Lovable design system (replaces the npm package and v0 setup)

- **PR:** [#5](https://github.com/Moragron/tailor-brands-design-system/pull/5)
- **Restore point (main before this PR):** `4a2117b6ccaa6b6d95880648edfe234b5e5d7a22` (0.2.0)
- **What changed:**
  - The repo is now a Lovable design-system project (local source, "Path A"): a Vite app whose `src/` is copied into connected projects at `src/design-system/<slug>/`.
  - `.lovable/system.md` replaces `AGENTS.md` as the agent instructions (setup, look, tokens, components, rules).
  - Generated token files moved from `tokens/` into `src/styles/` so they ship with the components: `tokens.css`, `theme.css` (Tailwind 4), plus new `tw3/preset.ts` (Tailwind 3 preset), `shadcn.css` and `tw3/shadcn.css` (shadcn/ui variables mapped to the tokens). `tokens/tokens.json` stays the source.
  - Components no longer import CSS from JS. New entries: `styles/index.css` (Tailwind 4, layered) and `styles/tw3/index.css` (Tailwind 3, plain); `depth.css` became `depth-core.css` plus a `depth.css` / `tw3/depth.css` entry per version.
  - `GatedContent` sets `inert` through a ref, so it also works on React 18 (Lovable's default).
  - New showcase app (`index.html`, `src/main.tsx`, `src/App.tsx`, `src/pages/Showcase.tsx`) for Lovable's preview; `npm run dev` / `npm run build`.
  - Removed: the `dist/` library build and package `exports`, `examples/next-app`, `docs/v0-import.md`, `AGENTS.md`.
- **Risk if reverted:** Lovable projects attached to this version keep working (their copy is local), but the next release would ship the old npm layout, which Lovable can't attach cleanly.

## 0.2.0: Opt-in page gradient and layered questionnaire background

- **PR:** [#4](https://github.com/Moragron/tailor-brands-design-system/pull/4)
- **Restore point (main before this PR):** `8a5747ee7c891fa0c0b94932d6d88a6614dc601f` (0.1.0)
- **What changed:**
  - New `depth.css` stylesheet, opt-in and imported after `styles.css` (since 0.3.0: `styles/depth.css` / `styles/tw3/depth.css`). It adds a bottom blue page glow, a hairline under the `StepLayout` header, a sticky translucent action bar, and a pink → violet → blue gradient ring on active inputs.
  - `StepLayout` footer markup gains an inner `.tb-step-layout__footer-inner` column.
  - `AutocompleteInput` gains `data-filled` once a value is picked.
  - `base.css` applies the page gradient to `<body>`. It stays `none` without `depth.css`.
  - Storybook gets a **Depth** toolbar toggle.
- **Risk if reverted:** none for apps that don't import `depth.css`. Apps that do import it must drop that import line.

## 0.1.0: Baseline

- **Commit:** `8a5747ee7c891fa0c0b94932d6d88a6614dc601f` (2026-10-01)
- Content-free design system: measured tokens, 15 components, Tailwind v4 theme, v0 import guide.
