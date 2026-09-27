import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './TimelineTabs.css';

export type TimelineTab = { id: string; label: string; content: ReactNode };

export type TimelineTabsProps = { tabs: TimelineTab[]; defaultTab?: string };

/** "This week / Quarterly / Yearly" tabs on the Custom Launch Plan (WAI-ARIA tabs pattern). */
export function TimelineTabs({ tabs, defaultTab }: TimelineTabsProps) {
  const id = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = (i + d + tabs.length) % tabs.length;
    setActive(tabs[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div className="tb-tabs">
      <div role="tablist" className="tb-tabs__list">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`${id}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${id}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className="tb-tabs__tab tb-focusable"
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${id}-panel-${t.id}`} aria-labelledby={`${id}-tab-${t.id}`} hidden={active !== t.id} className="tb-tabs__panel">
          {t.content}
        </div>
      ))}
    </div>
  );
}

export type TimelineGroup = { heading: string; items: string[] };

export function TimelineList({ groups }: { groups: TimelineGroup[] }) {
  return (
    <div className="tb-timeline">
      {groups.map((g) => (
        <section key={g.heading}>
          <h4 className="tb-timeline__heading">{g.heading}</h4>
          <ul className="tb-timeline__items">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}
