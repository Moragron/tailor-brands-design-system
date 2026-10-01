import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectionCardGroup } from './SelectionCard';

const OPTIONS = [
  { value: 'a', label: 'First option', description: 'A short supporting description' },
  { value: 'b', label: 'Second option', description: 'A short supporting description' },
  { value: 'c', label: 'Third option' },
];

const meta = { title: 'Components/SelectionCard', component: SelectionCardGroup } satisfies Meta<typeof SelectionCardGroup>;
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <SelectionCardGroup label="Choose one" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
export const Selected: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string | null>('b');
    return <SelectionCardGroup label="Choose one" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
