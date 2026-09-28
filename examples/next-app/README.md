# Example consumer app (Next.js App Router + Tailwind v4)

The minimal, correct way to use `tailor-brands-design-system` in an app. It's also the "real app that consumes it" source for the v0 import (see `docs/v0-import.md`).

| File | Shows |
|---|---|
| `app/globals.css` | The required CSS imports, in order |
| `app/layout.tsx` | No provider or font setup needed |
| `app/customers-step.tsx` | A `'use client'` step: `FlowLayout` + `ProgressStepper` + `ChipGroup` + gated `Button`, plus a token-based Tailwind utility |
| `app/page.tsx`, `app/plan/page.tsx` | Server components rendering design system components; the gated registration pattern |

```bash
npm install     # installs the design system from ../.. as a packed copy (.npmrc install-links=true)
npm run dev     # http://localhost:3000
```

From the repo root, `npm run example` does a clean install + production build (the same thing CI runs).
