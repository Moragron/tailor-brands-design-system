# reference/

The raw evidence every token and component traces back to. Written by `npm run capture`; never hand-edited.

| Path | Contents |
|---|---|
| `onboarding-flow-notes.md` | Manual walkthrough (26 Sep 2026): screen order, copy, defects. Primary source for flow and content. |
| `CAPTURE_LOG.md` | Every capture run: what was captured, which roles weren't found, where it stopped and why. |
| `screenshots/<screen>.png` | Full-page capture per screen, plus `__arrival` (before network idle), interaction states (`__autocomplete-open`, `__chip-selected`, `__drawer-open`, `__t3s`…`__t12s`) and `__FAILED` on errors. `@390` suffix = mobile pass. |
| `dom/<screen>.html`, `.css` | Serialised DOM and every stylesheet the page loaded (cross-origin sheets fetched). |
| `styles/<screen>.json` | `getComputedStyle()` for each role (h1, h2, body, buttons, input, chip, card, banner, modal, …), with CSS path, text and bounding box, plus a page-wide histogram. |
| `styles/_media.json` | All `@media` conditions seen, with counts (breakpoint evidence). |
| `styles/_derivation.md` | Written by `npm run tokens`: token → value → source → agreement → conflicting values. |

**Current state (1 Oct 2026):** captures exist for the pricing page, the homepage and the first three steps of the current "business guide" onboarding (`bg-*`), plus `bg-04-error__exit.png`, where the flow failed because hosts it depends on are blocked in the build environment (see `CAPTURE_LOG.md`). The tailored-onboarding flow described in `onboarding-flow-notes.md` is no longer served to new visitors, so no captures of it exist. Earlier failed attempts are kept in the log.
