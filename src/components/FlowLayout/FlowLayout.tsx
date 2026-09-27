import type { ReactNode } from 'react';
import './FlowLayout.css';

export type FlowLayoutProps = {
  /** Right side of the header: usually <ProgressStepper /> */
  top?: ReactNode;
  /** Above the header: usually a sticky <PromoBanner /> */
  banner?: ReactNode;
  children: ReactNode;
  /** Bottom-right CTA row: usually <Button>Next</Button> */
  footer?: ReactNode;
  /** Header wordmark. The real logo asset was not captured, so this defaults to plain text. */
  brand?: ReactNode;
};

/** Page shell for an onboarding screen: brand bar, optional sticky banner, centred column, footer CTA. */
export function FlowLayout({ top, banner, children, footer, brand = 'Tailor Brands' }: FlowLayoutProps) {
  return (
    <div className="tb-flow">
      {banner}
      <header className="tb-flow__header">
        <span className="tb-flow__brand">{brand}</span>
        {top}
      </header>
      <main className="tb-flow__main">{children}</main>
      {footer && <footer className="tb-flow__footer">{footer}</footer>}
    </div>
  );
}
