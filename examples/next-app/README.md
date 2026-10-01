# Example consumer app (Next.js App Router + Tailwind v4)

The minimal, correct way to use `tailor-brands-design-system` in an app. It's also the "real app that consumes it" source for the v0 import (see `docs/v0-import.md`).

| File | Shows |
|---|---|
| `app/globals.css` | The required CSS imports, in order |
| `app/layout.tsx` | No provider or font setup needed |
| `app/question-step.tsx` | A `'use client'` step: `StepLayout` + `ProgressStepper` + `ChipGroup` + a `Button` that stays disabled until answered, plus token-based Tailwind utilities |
| `app/page.tsx`, `app/results/page.tsx` | Server components rendering design-system components; content behind a sign-in gate |

```bash
npm install     # installs the design system from ../.. as a packed copy (.npmrc install-links=true)
npm run dev     # http://localhost:3000
```

From the repo root, `npm run example` does a clean install + production build (the same thing CI runs).
