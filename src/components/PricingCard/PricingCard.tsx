import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import './PricingCard.css';

export type PricingCardProps = {
  name: string;
  price: string;
  period?: string;
  priceNote?: string;
  /** e.g. "POPULAR" on Essential */
  badge?: string;
  features: ReactNode[];
  /** CTA label on the homepage pricing table was not recorded. */
  ctaLabel?: string;
  highlighted?: boolean;
};

export function PricingCard({ name, price, period, priceNote, badge, features, ctaLabel, highlighted }: PricingCardProps) {
  return (
    <article className="tb-pricing" data-highlighted={highlighted || undefined}>
      <header className="tb-pricing__head">
        <h3 className="tb-h3">{name}</h3>
        {badge && <span className="tb-badge">{badge}</span>}
      </header>
      <div className="tb-pricing__price">
        <span className="tb-h1">{price}</span>
        {period && <span className="tb-caption">{period}</span>}
      </div>
      {priceNote && <p className="tb-caption">{priceNote}</p>}
      <ul className="tb-pricing__features">{features.map((f, i) => <li key={i}>{f}</li>)}</ul>
      {ctaLabel && <Button fullWidth variant={highlighted ? 'primary' : 'secondary'}>{ctaLabel}</Button>}
    </article>
  );
}
