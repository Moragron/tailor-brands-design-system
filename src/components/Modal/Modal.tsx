import { useEffect, useId, useRef, type ReactNode } from 'react';
import './Modal.css';

export type ModalProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  /**
   * Whether the registration gate could be closed was NOT observed. Default false
   * (no close control) matches a hard gate; pass onClose to render one.
   */
  onClose?: () => void;
};

/** Dialog rendered inside a positioned container (not a portal) so it can sit over GatedContent. */
export function Modal({ open, title, children, onClose }: ModalProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('input, button, select, [tabindex]')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tb-modal__scrim">
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="tb-modal">
        {onClose && <button type="button" className="tb-modal__close tb-focusable" aria-label="Close" onClick={onClose}>×</button>}
        <h2 id={`${id}-title`} className="tb-h2 tb-modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export type GatedContentProps = {
  /** The content being teased (e.g. the Custom Launch Plan) */
  children: ReactNode;
  locked: boolean;
  /** Usually a <Modal> */
  gate: ReactNode;
};

/** Observed "blurred report behind modal" pattern on /registration. */
export function GatedContent({ children, locked, gate }: GatedContentProps) {
  return (
    <div className="tb-gated">
      <div className="tb-gated__content" data-locked={locked || undefined} aria-hidden={locked || undefined} inert={locked || undefined}>
        {children}
      </div>
      {locked && gate}
    </div>
  );
}
