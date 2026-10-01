// In-page probing, shared by capture.mjs and selftest-pipeline.mjs.
// probe() and histogram() are serialised into the browser by page.evaluate — keep them self-contained.
export const PROPS = [
  'color', 'backgroundColor', 'backgroundImage', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
  'letterSpacing', 'textTransform', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'borderTopWidth', 'borderTopStyle',
  'borderTopColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'boxShadow', 'maxWidth', 'width',
  'height', 'opacity', 'filter', 'backdropFilter', 'cursor', 'transition',
];

export function probe({ specs, PROPS }) {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const hasBox = (el) => {
    const cs = getComputedStyle(el);
    return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')
      || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
  };
  const cssPath = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 6; n = n.parentElement) {
      let p = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(`${p}#${n.id}`); break; }
      const cls = [...n.classList].slice(0, 2).join('.');
      if (cls) p += `.${cls}`;
      parts.unshift(p);
    }
    return parts.join(' > ');
  };
  const text = (el) => (el.innerText || el.value || '').trim().replace(/\s+/g, ' ');
  const looksLikeChip = (el) => {
    const r = el.getBoundingClientRect();
    const t = text(el);
    return hasBox(el) && r.height >= 24 && r.height <= 90 && t.length > 0 && t.length <= 60
      && el.parentElement && el.parentElement.children.length >= 3;
  };
  const out = {};
  for (const spec of specs) {
    const re = spec.text ? new RegExp(spec.text, 'i') : null;
    let found = null, usedSel = null;
    for (const sel of spec.selectors) {
      let els;
      try { els = [...document.querySelectorAll(sel)]; } catch { continue; }
      els = els.filter(visible);
      if (re) {
        els = els.filter((el) => re.test(text(el)));
        // Keep the deepest matches: with broad selectors ('*', 'div') every ancestor of the text
        // matches too, and the first in document order would be <html>.
        els = els.filter((el) => !els.some((o) => o !== el && el.contains(o)));
      }
      if (re && spec.leaf) els = els.filter((el) => ![...el.children].some((c) => re.test(text(c))));
      if (spec.chip) els = els.filter(looksLikeChip);
      // styleMatch: { prop, re } keeps elements whose computed style matches, e.g. a gradient background.
      if (spec.styleMatch) els = els.filter((el) => new RegExp(spec.styleMatch.re, 'i').test(getComputedStyle(el)[spec.styleMatch.prop]));
      if (els.length) { found = els[0]; usedSel = sel; break; }
    }
    if (!found) { out[spec.role] = null; continue; }
    if (spec.climbToBox) {
      let n = found;
      for (let i = 0; i < 6 && n && !hasBox(n); i++) n = n.parentElement;
      if (n) found = n;
    }
    const cs = getComputedStyle(found);
    const r = found.getBoundingClientRect();
    out[spec.role] = {
      matchedSelector: usedSel,
      path: cssPath(found),
      text: text(found).slice(0, 120),
      rect: { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) },
      styles: Object.fromEntries(PROPS.map((p) => [p, cs[p]])),
    };
  }
  return out;
}

export function histogram() {
  const h = {};
  const bump = (k, v) => { if (!v || v === 'none' || v === 'normal' || v === '0px' || v === 'auto') return; (h[k] ??= {})[v] = (h[k][v] ?? 0) + 1; };
  const els = [...document.querySelectorAll('body *')].slice(0, 4000);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (ownText) {
      bump('color', cs.color); bump('fontFamily', cs.fontFamily); bump('fontSize', cs.fontSize);
      bump('fontWeight', cs.fontWeight); bump('lineHeight', cs.lineHeight);
    }
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bump('backgroundColor', cs.backgroundColor);
    if (parseFloat(cs.borderTopWidth) > 0) bump('borderColor', cs.borderTopColor);
    bump('borderRadius', cs.borderTopLeftRadius); bump('boxShadow', cs.boxShadow);
    for (const p of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap']) bump('spacing', cs[p]);
  }
  return h;
}

