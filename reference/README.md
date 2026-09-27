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

**Current state:** only the notes and the capture log are here. The build environment's network policy blocks tailorbrands.com (see `CAPTURE_LOG.md`), so the screenshot/dom/styles folders are empty until `npm run capture` runs on an open network.
