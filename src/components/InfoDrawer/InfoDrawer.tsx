import { useId, useState, type ReactNode } from 'react';
import './InfoDrawer.css';

export type InfoDrawerSection = { heading: string; body: ReactNode };

export type InfoDrawerProps = {
  /** Observed trigger copy: "What is it" */
  triggerLabel?: string;
  /** Observed section headings: What / Why important / What we do */
  sections: InfoDrawerSection[];
  defaultOpen?: boolean;
};

/**
 * Inline disclosure. The notes call it a "drawer" but don't say whether it expands in place
 * or slides in as a sheet — check reference/screenshots/11-liability__drawer-open.png.
 */
export function InfoDrawer({ triggerLabel = 'What is it', sections, defaultOpen = false }: InfoDrawerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="tb-info-drawer">
      <button type="button" className="tb-info-drawer__trigger tb-focusable" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {triggerLabel}
        <span aria-hidden className="tb-info-drawer__chevron" data-open={open || undefined}>▾</span>
      </button>
      <div id={id} hidden={!open} className="tb-info-drawer__panel">
        {sections.map((s) => (
          <section key={s.heading}>
            <h4 className="tb-info-drawer__heading">{s.heading}</h4>
            <div className="tb-info-drawer__body">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
