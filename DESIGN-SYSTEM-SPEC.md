# Tailor Brands Design System: Brief

Use this brief to create a design system from scratch: design tokens plus a small library of React components. It describes the **look, the feel and the UX habits** that matter. How you structure the code, name things and fill the gaps is up to you, as long as the result feels like this.

**Content-free:** the design system ships no product copy. Every heading, label, option and message comes from the app using it. Use neutral placeholder text in demos ("Option A", "Continue", "Your logo").

---

## The vibe in one paragraph

Calm, clean and confident. White pages, a **narrow centred column (~576px)**, and lots of air. **Black headings in an elegant display serif**, **soft grey body text in a clean sans**. Everything you can press or pick is **pill-shaped**. Colour is used sparingly: **one bright blue for the main action**, a **warm yellow** for announcements, a touch of **green** for badges. Selected things don't get coloured borders. They **go bold and lift off the page on a soft, blue-tinted shadow**. An optional layered mode adds a **soft blue glow rising from the bottom of the page** and a **pink → violet → blue gradient ring** on the field you're typing in.

---

## Colours

| Role | Value | Notes |
|---|---|---|
| Headings / primary text | `#000000` | |
| Body and secondary text | `#727585` | Same grey for body and muted text; hierarchy comes from size and weight |
| Page and card background | `#ffffff` | Flat white surfaces |
| Subtle fill | `#f4f4f4` | Tab tracks, info panels, the hovered or active list option |
| Input / chip border | `#dfe2e6` | Light hairline |
| Card / divider border | `#d1d5db` | Slightly stronger hairline |
| **Primary action** | **`#166cff`** | Bright blue, white text |
| Primary hover | `#155cba` | Deeper blue |
| Primary disabled | `rgba(22, 108, 255, 0.3)` | 30% blue, white text |
| Secondary action | white bg, black text, `#d1d5db` border | |
| Announcement banner | `#ffd272` with black text | Warm yellow |
| Badge | `#0b825b` text and outline, no fill | Small uppercase tag |
| Progress fill / track | `#166cff` / `rgba(0, 0, 0, 0.1)` | |
| Overlay scrim | `rgba(255, 255, 255, 0.85)` + 12px blur | White frosted glass, not a dark backdrop |
| Error | Neutral; no red in the palette | Communicate errors with clear text, not colour alone |

Express all of these as design tokens (CSS variables and/or Tailwind theme values), and never hard-code them in components.

---

## The gradient (optional "layered" look)

The default look is **flat**. The layered look is a switchable mode for step-by-step flows:

- **Page glow:** a soft blue haze rising from the bottom of the page, white at the top.
  `radial-gradient(60% 60% at 50% 95%, #dde8f5 0%, rgba(221, 232, 245, 0.55) 45%, transparent 100%)`
- **Accent gradient (active-input ring):** pink → violet → blue.
  `linear-gradient(80deg, #d46fbb 0%, #b760c8 30%, #6074d8 80%)`
  When a text field is focused (or an autocomplete has a value), its border becomes a **2px ring in this gradient**, with a **faint blue tint** (`#eef2fe`) fading in from the right inside the field.
- **Action bar:** the bottom bar with Back / Continue becomes **sticky, translucent (≈35% white) and blurred (12px)**, so the glow shows through it. It has a thin divider (`#dfe7ef`) on top, and there's a matching hairline under the header.
- **Section band** (optional): `linear-gradient(180deg, #ffffff 0%, #dde8f5 100%)` for an area that fades into the glow.

Use the accent gradient sparingly: it marks "you are here", not decoration.

---

## Typography

- **Headings:** a condensed display serif (licensed font *Memories*; fall back to Georgia / Times New Roman). About **28–29px**, regular to medium weight, black.
- **Text:** a clean geometric sans (licensed font *Proxima Nova*; fall back to Helvetica / Arial). Body about **15px** with a 24px line height, grey.
- **Captions and labels** are about **16px** but muted grey: secondary through colour, not through being tiny.
- **Selected or emphasised** items use **semibold (600)**.
- Don't load the licensed fonts; let the fallbacks render.

---

## Shape, space and depth

- **Pills everywhere you interact:** buttons, chips, text inputs, tabs, progress bars.
- **Cards** have **16px** rounded corners and a thin grey border. **No drop shadows on cards.**
- **Modals and banners** are square-cornered.
- **4px spacing grid**, generous whitespace.
- **The only shadow in the system is the selection lift:** `rgba(134, 153, 237, 0.35) 0 8px 24px -8px, rgba(61, 88, 143, 0.25) 0 4px 12px -4px`.

---

## Buttons

- **Pill-shaped**, comfortable padding (about 12px × 24px), 16px regular-weight text.
- **Primary:** solid bright blue with white text; deeper blue on hover; **30% faded blue when disabled**. Disabled is the normal state of "Continue" until the step is answered.
- **Secondary:** white with a thin grey border and black text, for Back, Skip, Remove and other secondary choices.
- **One primary (blue) button per view.** Everything else is secondary.
- Full-width variant for modals, cards and mobile.
- Back sits on the left and Continue on the right of the action bar. A lone action sits on the right.

---

## Selection (the signature interaction)

- **Chips** for short options: pill-shaped, white, thin grey border. **Selected = bold text + the soft blue lift shadow, and the border disappears.** They work as multi-select (checkboxes) or single-select (radios). An optional pill text field under the chips captures "something else".
- **Selection cards** for options that need a description: full-width rounded cards with a small radio circle. Selected = the same bold + lift, and the **radio becomes a thick blue ring**.
- **Autocomplete** for long lists: typing only filters. **The answer counts only once an option is actually picked from the list**; editing the text clears it again.
- **Tabs** are a **segmented pill control**: a light grey track, with the active tab as a white pill in bold black text.

---

## Small UX details worth keeping

- **One question per page.** A focused flow: header (logo left, progress right), the question as a serif heading, the answers, and a bottom action bar.
- **Progress** is shown either as a compact muted counter ("2/5") or as a row of named sections with the active one bold and underlined.
- **Continue stays disabled** until the step has a valid answer.
- **Announcement strip:** a full-width yellow bar above the header that sticks to the top while scrolling, with an optional × to dismiss.
- **Optional extras** are listed in a card with a small uppercase grey title. Each row has a title, an optional green badge and price, an optional "Learn more" link, and an **Add ↔ Remove** toggle (Add is primary; once added, the button turns into a secondary "Remove"). Or a **Skip / Add** pair.
- **"Learn more"** is an underlined text link with a small chevron that flips when open. It expands an inline panel on the light grey fill instead of opening a new page.
- **Progress loader:** a big percentage number, a slim pill bar, and a **status line that changes as progress advances**. It reserves space so the layout doesn't jump.
- **Assistant "thinking"** state: a muted label followed by three softly blinking dots. **No animation when the user prefers reduced motion.**
- **Gated results:** content stays visible but **blurred and non-interactive** behind a white frosted scrim, with a centred dialog on top (for example "create an account to see your results"). The dialog title is centred; a gate without a close button can't be dismissed.
- **Dialogs** focus their first field when opened and close on Escape (when closable).
- **Pricing cards:** plan name with an optional badge, a big serif price with a small muted period, a short feature list and a full-width button. **The recommended plan gets a 2px blue border and the only primary button.**
- **Grouped lists:** small uppercase grey group headings, with rows separated by hairlines.

---

## Accessibility (non-negotiable)

- Every input and option group has a label (it can be visually hidden when the page heading already asks the question).
- Use proper roles: checkboxes/radios for chips and cards, a combobox for autocomplete, tabs, a dialog, and a progressbar.
- Arrow keys move through selection cards and tabs.
- Every interactive element shows a clear keyboard focus ring (a 2px black outline; in layered mode the gradient ring replaces it on inputs).

---

## Suggested component set

Build roughly this set. Adapt the APIs as you see fit, and pass all copy in as props:

Page layout (header, centred column, action bar) · Button · Progress indicator · Chip group · Selection cards · Text input (label, helper, prefix, error) · Autocomplete · Announcement banner · Add-on list · Learn-more disclosure · Percentage loader · Assistant message · Modal + gated content · Tabs + grouped list · Pricing card.

Finish with a **showcase page** that renders every component with placeholder copy and includes a **flat / layered toggle**.
