import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SuiteCard, SuiteItem } from './SuiteCard';
import { NOT_CAPTURED } from '../../data/notCaptured';

const info = [
  { heading: 'What', body: NOT_CAPTURED },
  { heading: 'Why important', body: NOT_CAPTURED },
  { heading: 'What we do', body: NOT_CAPTURED },
];

function useItems(names: string[]) {
  const [added, setAdded] = useState<Record<string, boolean>>(Object.fromEntries(names.map((n) => [n, true])));
  return { added, set: (n: string) => (v: boolean) => setAdded((a) => ({ ...a, [n]: v })) };
}

const meta = {
  title: 'Components/SuiteCard',
  component: SuiteCard,
  parameters: { reference: { screenshot: '11-liability.png', note: 'Items are PRE-ADDED (opt-out) — observed', role: 'card' } },
} satisfies Meta<typeof SuiteCard>;
export default meta;

export const PersonalLiabilitySuite: StoryObj = {
  name: 'Personal Liability Suite (pre-added, as observed)',
  render: () => {
    const names = ['Annual Report', 'EIN', 'Operating Agreement'];
    const { added, set } = useItems(names);
    return (
      <SuiteCard title="PERSONAL LIABILITY SUITE">
        {names.map((n) => <SuiteItem key={n} title={n} info={info} added={added[n]} onChange={set(n)} />)}
      </SuiteCard>
    );
  },
};

export const BrandingSuite: StoryObj = {
  name: 'Branding Suite (pre-added, as observed)',
  parameters: { reference: { screenshot: '12-branding.png' } },
  render: () => {
    const names = ['Website', 'Domain'];
    const { added, set } = useItems(names);
    return <SuiteCard title="BRANDING SUITE">{names.map((n) => <SuiteItem key={n} title={n} added={added[n]} onChange={set(n)} />)}</SuiteCard>;
  },
};

export const NotificationsAddOn: StoryObj = {
  name: 'Choice mode — "Business Updates & Notification *FREE" (Skip / Add)',
  parameters: { reference: { screenshot: '10-entity.png', note: 'Add = SMS/call marketing consent (TCPA)' } },
  render: () => {
    const [added, setAdded] = useState(false);
    return <SuiteCard title="ADD-ON"><SuiteItem title="Business Updates & Notification" badge="*FREE" mode="choice" added={added} onChange={setAdded} /></SuiteCard>;
  },
};

export const ProposalShowPrice: StoryObj = {
  name: 'Growth proposal — price shown next to each item',
  parameters: { reference: null },
  render: () => {
    const names = ['Annual Report', 'EIN', 'Operating Agreement'];
    const { added, set } = useItems(names);
    return (
      <SuiteCard title="PERSONAL LIABILITY SUITE">
        {names.map((n) => <SuiteItem key={n} title={n} price="$— (price not shown on live site)" info={info} added={added[n]} onChange={set(n)} />)}
      </SuiteCard>
    );
  },
};
