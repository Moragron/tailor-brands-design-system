import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AddOnCard, AddOnItem } from './AddOnCard';

const details = { triggerLabel: 'Learn more', sections: [{ heading: 'What it is', body: 'A short explanation.' }, { heading: 'Why it helps', body: 'A short explanation.' }] };

const meta = { title: 'Components/AddOnCard', component: AddOnCard } satisfies Meta<typeof AddOnCard>;
export default meta;

export const ToggleItems: StoryObj = {
  render: () => {
    const [added, setAdded] = useState<Record<string, boolean>>({ First: false, Second: true, Third: false });
    const set = (k: string) => (v: boolean) => setAdded((a) => ({ ...a, [k]: v }));
    return (
      <AddOnCard title="Optional extras">
        <AddOnItem title="First item" price="$9/mo" info={details} added={added.First} onChange={set('First')} />
        <AddOnItem title="Second item" price="$19/mo" added={added.Second} onChange={set('Second')} />
        <AddOnItem title="Third item" badge="New" description="A short supporting description" added={added.Third} onChange={set('Third')} />
      </AddOnCard>
    );
  },
};
export const ChoiceItem: StoryObj = {
  render: () => {
    const [added, setAdded] = useState(false);
    return <AddOnCard title="Optional extra"><AddOnItem title="Item name" mode="choice" added={added} onChange={setAdded} /></AddOnCard>;
  },
};
