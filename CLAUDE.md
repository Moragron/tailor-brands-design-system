# CLAUDE.md

Guide for Claude Code working in this repository. Read it before any change.

## What this repo is

The **Tailor Brands design system**: measured design tokens + 15 content-free React components (Tailwind 4 or 3, React 18/19, no runtime deps). It is the **single source of truth** for two platforms:

| Platform | How it gets the design system | Platform-specific files here |
|---|---|---|
| **Lovable** | `npm run lovable:sync` copies it into the Lovable project repo `Moragron/tailor-brands-home-assignment`, then **Release version** in Lovable | `.lovable/system.md`, `.dsignore`, `scripts/sync-lovable.mjs` |
| **Claude** | This repo directly (Claude Code), plus the skills in `.claude/skills/` | `CLAUDE.md`, `.claude/skills/` |

The core (`tokens/`, `src/components/`, `src/styles/`, `src/index.ts`) belongs to neither platform. Never fork it per platform; platform layers only describe or deliver the core.

**`.lovable/system.md` is the canonical guide to the components, props, tokens, design rules and the "don't" list.** Don't duplicate it here or in skills; link to it. When a component's API changes, update `system.md` in the same PR.

## Personal project

This is a personal project, kept separate from the owner's employer. Don't bring in conventions, packages, internal URLs, names or tooling from any workplace, even if a user-level `~/.claude/` config suggests them; this file and `.claude/skills/` are what apply here. Commits and PRs go through the owner's personal GitHub account (Moragron), never a work email or work account. Before every PR, check the diff contains no workplace names, internal hosts or credentials.

## Commands

```bash
npm ci                     # install (Node 22, see .nvmrc)
npm run typecheck
npm run tokens:css         # after editing tokens/tokens.json (regenerates src/styles/tokens.css, theme.css, shadcn.css, tw3/*)
npm run tokens:check       # fails if generated token files are stale
npm run build              # showcase build (what Lovable previews)
npm run build-storybook
npm run preview:build      # showcase as a shareable preview → preview-dist/ (see "Previews")
```

CI (`.github/workflows/ci.yml`) runs typecheck, tokens:check, build, both Storybook builds and the research self-test.

## Rules for changing the system

From the "Maintaining" section of `.lovable/system.md`, which stays authoritative:

- Keep every import inside `src/` **relative** (no `@/`); `src/` is relocated on attach.
- Components never import CSS. Register each component's `.css` in `src/styles/components.css` and export the component from `src/index.ts`.
- Component CSS is plain (no `@layer`, no `@theme`).
- Tokens: edit `tokens/tokens.json`, run `npm run tokens:css`. Never hand-edit generated files.
- No hard-coded colours, font sizes, radii or shadows; use tokens.
- Components carry no copy. Showcase and stories use placeholder copy.
- `research/` is analysis only. Never copy its text, screens or flows into `src/`.

## Workflow

1. Work on the designated `claude/*` branch, never directly on `main`.
2. Run `typecheck`, `tokens:check` and `build` before every push.
3. **Publish a preview** after each meaningful change (see below) and give the owner the link.
4. Every PR: a `CHANGELOG.md` entry (what changed, restore point = `main` commit before it, risk if reverted) and a `version` bump in `package.json`.
5. After merge, if the change affects what ships (`src/`, `tokens/`, `.lovable/system.md`), sync to Lovable (skill `tb-ds-change`, last step).

## Previews

The owner works from Claude Code on the web (a cloud container), so there is no `localhost` to open. Every review goes through a published preview:

- `npm run preview:build` builds the showcase into `preview-dist/` with a stamp (version, branch, commit, build time).
- Publish it with the Artifact tool to the **same preview URL every time**, so the owner keeps one link:
  **Preview artifact:** https://claude.ai/artifact/6NpXAHGbinWXpdYicHXm1e
- Details in `.claude/skills/tb-ds-preview/SKILL.md`.

Storybook from `main` is also deployed to GitHub Pages by `.github/workflows/storybook-pages.yml`.
