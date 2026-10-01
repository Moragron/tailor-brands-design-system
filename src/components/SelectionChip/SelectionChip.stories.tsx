import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChipGroup, SelectionChip } from './SelectionChip';

const OPTIONS = ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'];

const meta = { title: 'Components/SelectionChip', component: SelectionChip } satisfies Meta<typeof SelectionChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Option A', selected: false, onToggle: () => {} } };
export const Selected: Story = { args: { label: 'Option A', selected: true, onToggle: () => {} } };

export const MultiSelectGroup: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string[]>(['Option B']);
    return <ChipGroup label="Choose all that apply" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
export const SingleSelectGroup: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return <ChipGroup mode="single" label="Choose one" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
export const WithFreeText: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const [other, setOther] = useState('');
    return <ChipGroup label="Choose all that apply" options={OPTIONS} value={value} onChange={setValue} freeText={{ value: other, onChange: setOther, placeholder: 'Something else…' }} />;
  },
};
