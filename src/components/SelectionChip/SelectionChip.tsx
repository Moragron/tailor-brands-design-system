import { useId, type ReactNode } from 'react';
import './SelectionChip.css';

export type SelectionChipProps = {
  label: ReactNode;
  selected: boolean;
  onToggle: () => void;
  /** multi → role="checkbox"; single → role="radio" */
  mode?: 'multi' | 'single';
};

export function SelectionChip({ label, selected, onToggle, mode = 'multi' }: SelectionChipProps) {
  return (
    <button
      type="button"
      role={mode === 'multi' ? 'checkbox' : 'radio'}
      aria-checked={selected}
      className="tb-chip tb-focusable"
      data-selected={selected || undefined}
      onClick={onToggle}
    >
      {label}
    </button>
  );
}

export type ChipGroupProps = {
  /** Question heading, used as the group's accessible name */
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  mode?: 'multi' | 'single';
  /** Free-text field under the chips (observed on "Who are …'s customers?") */
  freeText?: { placeholder?: string; value: string; onChange: (v: string) => void };
};

export function ChipGroup({ label, options, value, onChange, mode = 'multi', freeText }: ChipGroupProps) {
  const id = useId();
  const toggle = (opt: string) => {
    if (mode === 'single') return onChange([opt]);
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div className="tb-chip-group">
      <div role={mode === 'multi' ? 'group' : 'radiogroup'} aria-labelledby={`${id}-label`} className="tb-chip-group__chips">
        <span id={`${id}-label`} className="tb-visually-hidden">{label}</span>
        {options.map((o) => (
          <SelectionChip key={o} label={o} mode={mode} selected={value.includes(o)} onToggle={() => toggle(o)} />
        ))}
      </div>
      {freeText && (
        <input
          className="tb-chip-group__free-text tb-focusable"
          aria-label={`${label} — other`}
          placeholder={freeText.placeholder}
          value={freeText.value}
          onChange={(e) => freeText.onChange(e.target.value)}
        />
      )}
    </div>
  );
}
