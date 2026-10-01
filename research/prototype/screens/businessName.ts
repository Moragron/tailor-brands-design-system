/**
 * Observed bug (screen 4): "Swell & Salt Surf Co." was rendered as "Swell Salt" — the ampersand and
 * "Surf Co." were dropped. This reproduces that output so the bug can be shown side by side with the fix.
 */
export function buggyShortName(name: string) {
  return name.replace(/\b(surf|co|llc|inc)\b\.?/gi, '').replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

/** Fix: use the name exactly as the user typed it. */
export const displayName = (name: string) => name.trim();
