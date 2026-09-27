import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectionCardGroup } from './SelectionCard';

// Only the first, last and opt-out bands were recorded in the notes ("Not yet … >$25k, Prefer not to say").
const BANDS = [
  { value: 'not-yet', label: 'Not yet' },
  { value: 'gt-25k', label: '>$25k', description: 'Intermediate bands were not recorded — see reference capture' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const meta = {
  title: 'Components/SelectionCard',
  component: SelectionCardGroup,
  parameters: { reference: { screenshot: '07-business-expenses.png', note: 'Revenue bands (6/6)', role: 'card' } },
} satisfies Meta<typeof SelectionCardGroup>;
export default meta;

export const RevenueBands: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <SelectionCardGroup label="How much do you bring in each month?" options={BANDS} value={value} onChange={setValue} />;
  },
};
export const Selected: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string | null>('not-yet');
    return <SelectionCardGroup label="How much do you bring in each month?" options={BANDS} value={value} onChange={setValue} />;
  },
};
