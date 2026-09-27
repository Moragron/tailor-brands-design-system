import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { InfoDrawer, type InfoDrawerSection } from '../InfoDrawer/InfoDrawer';
import './SuiteCard.css';

export type SuiteCardProps = {
  /** Observed: "PERSONAL LIABILITY SUITE", "BRANDING SUITE" */
  title: string;
  children: ReactNode;
};

export function SuiteCard({ title, children }: SuiteCardProps) {
  return (
    <section className="tb-suite" aria-label={title}>
      <h3 className="tb-suite__title">{title}</h3>
      <ul className="tb-suite__items">{children}</ul>
    </section>
  );
}

export type SuiteItemProps = {
  title: string;
  /** e.g. "*FREE" on the notifications add-on */
  badge?: string;
  description?: ReactNode;
  info?: InfoDrawerSection[];
  /**
   * toggle: one button flipping Remove ↔ Add (Liability / Branding suites; items start ADDED — opt-out).
   * choice: two buttons Skip / Add (the "Business Updates & Notification" SMS-consent card on /entity).
   */
  mode?: 'toggle' | 'choice';
  added: boolean;
  onChange: (added: boolean) => void;
  /**
   * Not shown anywhere on the live site (notes: "No prices shown"). Exposed so the growth
   * proposal "show price next to pre-added items" can be prototyped.
   */
  price?: ReactNode;
};

export function SuiteItem({ title, badge, description, info, mode = 'toggle', added, onChange, price }: SuiteItemProps) {
  return (
    <li className="tb-suite-item" data-added={added || undefined}>
      <div className="tb-suite-item__main">
        <div className="tb-suite-item__title">
          {title}
          {badge && <span className="tb-badge">{badge}</span>}
          {price && <span className="tb-suite-item__price">{price}</span>}
        </div>
        {description && <p className="tb-caption">{description}</p>}
        {info && <InfoDrawer sections={info} />}
      </div>
      <div className="tb-suite-item__actions">
        {mode === 'toggle' ? (
          <Button variant={added ? 'secondary' : 'primary'} aria-pressed={added} onClick={() => onChange(!added)}>
            {added ? 'Remove' : 'Add'}
          </Button>
        ) : (
          <>
            <Button variant="secondary" aria-pressed={!added} onClick={() => onChange(false)}>Skip</Button>
            <Button variant="primary" aria-pressed={added} onClick={() => onChange(true)}>Add</Button>
          </>
        )}
      </div>
    </li>
  );
}
