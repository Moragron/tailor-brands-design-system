# Changelog

One entry per merged pull request, newest first. Each entry records the **restore point**: the `main` commit just before the PR was merged. If a change makes things worse, you can go back in one of three ways.

## How to go back

1. **Undo one PR (recommended).** Open the merged PR on GitHub and click **Revert**. GitHub opens a new PR that undoes exactly that change, and later PRs stay in place. Merge it like any other PR.
2. **Pin an app to a known-good version without changing the repo.** Install the package at a restore point:
   ```bash
   npm install github:Moragron/tailor-brands-design-system#<restore-point-sha>
   ```
   In v0, ask: *"Install the design system at commit `<restore-point-sha>`."*
3. **From the command line** (undo a merged PR on a new branch, then open a PR from it):
   ```bash
   git revert -m 1 <merge-commit-sha>
   ```
   The merge commit SHA is shown at the bottom of the merged PR ("merged commit …").

Each PR also bumps `version` in `package.json`, so you can tell which version an app is running.

---

## 0.2.0: Opt-in page gradient and layered questionnaire background

- **PR:** [#4](https://github.com/Moragron/tailor-brands-design-system/pull/4)
- **Restore point (main before this PR):** `8a5747ee7c891fa0c0b94932d6d88a6614dc601f` (0.1.0)
- **What changed:**
  - New `depth.css` stylesheet, opt-in and imported after `styles.css`. It adds a bottom blue page glow, a hairline under the `StepLayout` header, a sticky translucent action bar, and a pink → violet → blue gradient ring on active inputs.
  - `StepLayout` footer markup gains an inner `.tb-step-layout__footer-inner` column.
  - `AutocompleteInput` gains `data-filled` once a value is picked.
  - `base.css` applies the page gradient to `<body>`. It stays `none` without `depth.css`.
  - Storybook gets a **Depth** toolbar toggle.
- **Risk if reverted:** none for apps that don't import `depth.css`. Apps that do import it must drop that import line.

## 0.1.0: Baseline

- **Commit:** `8a5747ee7c891fa0c0b94932d6d88a6614dc601f` (2026-10-01)
- Content-free design system: measured tokens, 15 components, Tailwind v4 theme, v0 import guide.
