import { useState } from 'react';

export type Reference = {
  /** File name inside reference/screenshots/, e.g. "04-about-your-business-1.png" */
  screenshot: string;
  /** Which notes line / capture this component was built from */
  note?: string;
  /**
   * Capture role (key in reference/styles/<screen>.json → roles) whose bounding box
   * visual-qa crops the reference to, so a component is compared with just that element.
   */
  role?: string;
};

/** Shows the live-site capture a story is meant to match, or says plainly that none exists yet. */
export function ReferencePanel({ reference }: { reference?: Reference | null }) {
  const [missing, setMissing] = useState(false);
  if (!reference) return null;
  return (
    <aside className="sb-reference" aria-label="Reference capture" data-reference-screenshot={reference.screenshot} data-reference-role={reference.role}>
      <div className="sb-reference__label">
        Reference: <code>reference/screenshots/{reference.screenshot}</code>
        {reference.note && <span> · {reference.note}</span>}
      </div>
      {missing ? (
        <div className="sb-reference__missing">
          No capture yet. Run <code>npm run capture</code> on a network that can reach tailorbrands.com.
        </div>
      ) : (
        <img src={`reference/screenshots/${reference.screenshot}`} alt={`Live-site capture: ${reference.screenshot}`} onError={() => setMissing(true)} />
      )}
    </aside>
  );
}
