---
name: tb-ds-preview
description: Build the Tailor Brands design-system showcase and publish it as the shared preview Artifact, so the owner can review a change from a link (there is no localhost in the cloud session). Use after any visible change to tokens, components, styles or the showcase, or when asked to "show", "preview" or "share" the design system.
---

# Publish the design-system preview

1. Build: `npm run preview:build`. It writes `preview-dist/index.html` and `preview-dist/assets/*` (relative paths, Artifact-ready) and stamps the page with version, branch, commit and build time. Commit first when you can, so the stamp names a pushed commit instead of "+ uncommitted changes".
2. Publish with the Artifact tool:
   - `file_path`: `preview-dist/index.html`
   - `files`: every file under `preview-dist/assets/`, keyed by its published path, e.g. `{"assets/index-AbC123.css": "preview-dist/assets/index-AbC123.css"}`. File names are hashed, so list the directory after each build. Map stale names from the previous publish to `null` so they're removed.
   - `url`: the **Preview artifact** URL in `CLAUDE.md`, so the link never changes. Read the artifact first (`action: "read"`) if this session hasn't published it yet.
   - `description`: one sentence naming what changed in this build.
   - `label`: the branch or PR, e.g. `PR #7`.
3. Give the owner the link and one line on what to look at.

Only if the preview artifact doesn't exist yet: publish without `url` (pass `icon: "palette"`), then record the new URL in `CLAUDE.md` under "Previews" in the same PR.

Don't redesign the page for the Artifact host: it is the showcase as it ships. The design system has no dark theme, so the preview pins the light look on purpose.
