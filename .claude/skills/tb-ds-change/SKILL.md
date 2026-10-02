---
name: tb-ds-change
description: End-to-end workflow for changing the Tailor Brands design system (tokens, components, styles, agent guide) in this repo and shipping it to both Claude and Lovable. Use for any change under tokens/, src/components/, src/styles/, src/index.ts or .lovable/system.md, including adding or removing a component.
---

# Change the design system

The rules are in `CLAUDE.md` ("Rules for changing the system") and in the "Maintaining" section of `.lovable/system.md`. This is the order of work.

## 1. Make the change

- **Token:** edit `tokens/tokens.json` (derivation rules and placeholders live in `tokens/tokens.base.json`), then `npm run tokens:css`. Commit the regenerated files with it.
- **Existing component:** edit `src/components/<Name>/<Name>.tsx` and `<Name>.css`. Use tokens (`var(--tb-…)`) only. Update its `<Name>.stories.tsx`.
- **New component:** create `src/components/<Name>/` with `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx`; add the CSS to `src/styles/components.css`; export from `src/index.ts`; add a section to `src/pages/Showcase.tsx` with placeholder copy.
- **Any API change** (component, prop, token utility): update the tables and examples in `.lovable/system.md`. It is the guide both Lovable's agent and the `tb-ds-build-ui` skill rely on.

## 2. Verify

```bash
npm run typecheck && npm run tokens:check && npm run build && npm run build-storybook
```

All must pass; CI runs the same checks.

## 3. Preview

Run the `tb-ds-preview` skill and send the owner the link.

## 4. Pull request

- Add a `CHANGELOG.md` entry at the top (format of the existing entries: PR link, restore point = current `origin/main` SHA and version, what changed, risk if reverted) and bump `version` in `package.json` (patch for fixes and docs, minor for new tokens, components or props, major for breaking changes).
- Check the diff for workplace names, internal URLs or credentials (see "Personal project" in `CLAUDE.md`).
- Push to the designated branch. Open the PR only when the owner asks.

## 5. Ship to Lovable (after merge, only if shipped files changed)

Shipped files: `src/` (except the showcase and stories), `tokens/`, `.lovable/system.md`, `.dsignore`, `scripts/build-tokens-css.mjs`. Changes to `CLAUDE.md`, `.claude/` or `research/` don't need a sync.

1. Add `Moragron/tailor-brands-home-assignment` to the session (push access) and clone it next to this repo.
2. `npm run lovable:sync -- ../tailor-brands-home-assignment`
3. In that checkout: `bun install && bunx tsc --noEmit && bun run build`, then commit (`Sync design system vX.Y.Z`) and push to `main`.
4. Tell the owner to select **Release version** in the Lovable design-system project. Record the synced commit in the CHANGELOG entry.
