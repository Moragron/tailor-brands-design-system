import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '../../tokens/tokens.json';

type Token = { $type: string; $value: string; $observed: boolean; $source: string | null; $note?: string; $evidence?: string };

function flatten(node: Record<string, unknown>, path: string[] = []): [string, Token][] {
  return Object.entries(node).flatMap(([k, v]) => {
    if (k.startsWith('$') || typeof v !== 'object' || v === null) return [];
    return '$value' in v ? [[[...path, k].join('-'), v as Token]] : flatten(v as Record<string, unknown>, [...path, k]);
  });
}

function TokenTable({ group }: { group: keyof typeof tokens }) {
  const rows = flatten(tokens[group] as Record<string, unknown>, [String(group)]);
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', font: '13px/1.4 system-ui, sans-serif' }}>
      <thead>
        <tr>{['', 'CSS variable', 'Value', 'Observed', 'Source / note'].map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 6 }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(([name, t]) => (
          <tr key={name}>
            <td style={{ padding: 6, width: 40 }}>
              {t.$type === 'color' && <span style={{ display: 'inline-block', width: 28, height: 28, borderRadius: 4, border: '1px solid #ccc', background: `var(--tb-${name})` }} />}
              {t.$type === 'dimension' && group === 'radius' && <span style={{ display: 'inline-block', width: 28, height: 28, border: '2px solid #333', borderRadius: `var(--tb-${name})` }} />}
              {t.$type === 'shadow' && <span style={{ display: 'inline-block', width: 28, height: 28, background: '#fff', boxShadow: `var(--tb-${name})` }} />}
            </td>
            <td style={{ padding: 6 }}><code>--tb-{name}</code></td>
            <td style={{ padding: 6 }}><code>{t.$value}</code></td>
            <td style={{ padding: 6 }}>{t.$observed ? '✅ yes' : '⚠️ placeholder'}</td>
            <td style={{ padding: 6, color: '#555' }}>{t.$source ?? t.$note ?? '—'}{t.$evidence ? ` (${t.$evidence})` : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta = { title: 'Tokens/All tokens', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;

export const Status: StoryObj = {
  render: () => (
    <div style={{ font: '14px/1.5 system-ui, sans-serif', maxWidth: 720 }}>
      <h2>Token set status: {tokens.$meta.status}</h2>
      <p>{tokens.$meta.statusNote}</p>
    </div>
  ),
};
export const Color: StoryObj = { render: () => <TokenTable group="color" /> };
export const Typography: StoryObj = { render: () => <TokenTable group="font" /> };
export const Spacing: StoryObj = { render: () => <TokenTable group="space" /> };
export const Radius: StoryObj = { render: () => <TokenTable group="radius" /> };
export const Shadow: StoryObj = { render: () => <><TokenTable group="shadow" /><TokenTable group="effect" /></> };
export const Breakpoints: StoryObj = { render: () => <><TokenTable group="breakpoint" /><TokenTable group="layout" /></> };
