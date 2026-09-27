import type { ReactNode } from 'react';
import './FlowLayout.css';

export type FlowLayoutProps = {
  top?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Page shell for an onboarding screen: brand bar, optional sticky banner, centred column, footer CTA. */
export function FlowLayout({ top, banner, children, footer }: FlowLayoutProps) {
  return (
    <div className="tb-flow">
      {banner}
      <header className="tb-flow__header">
        {/* Wordmark rendered as plain text: the logo asset was not captured. */}
        <span className="tb-flow__brand">Tailor Brands</span>
        {top}
      </header>
      <main className="tb-flow__main">{children}</main>
      {footer && <footer className="tb-flow__footer">{footer}</footer>}
    </div>
  );
}
