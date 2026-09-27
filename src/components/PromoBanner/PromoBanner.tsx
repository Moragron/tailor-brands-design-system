import type { ReactNode } from 'react';
import './PromoBanner.css';

export type PromoBannerProps = {
  emoji?: string;
  children: ReactNode;
  /** Omit to render a non-dismissible banner. Dismissal is OBSERVED on /entity. */
  onDismiss?: () => void;
  /** Sticks to the top of the scroll container */
  sticky?: boolean;
};

export function PromoBanner({ emoji, children, onDismiss, sticky = true }: PromoBannerProps) {
  return (
    <div className={`tb-promo${sticky ? ' tb-promo--sticky' : ''}`} role="region" aria-label="Promotion">
      {emoji && <span className="tb-promo__emoji" aria-hidden>{emoji}</span>}
      <span className="tb-promo__text">{children}</span>
      {onDismiss && (
        <button type="button" className="tb-promo__close tb-focusable" aria-label="Dismiss promotion" onClick={onDismiss}>×</button>
      )}
    </div>
  );
}
