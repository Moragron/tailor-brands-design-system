import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChipGroup, SelectionChip } from './SelectionChip';

// Exact AI-generated options recorded in onboarding-flow-notes.md (screen 5).
const CUSTOMERS = ['Local surfers', 'Visiting surfers', 'Beginner', 'Experienced', 'Families', 'Surf lesson students', 'Still figuring out'];
const CHANNELS = ['In-store pickup', 'Local delivery', 'In-person lessons', 'Online lessons'];

const meta = {
  title: 'Components/SelectionChip',
  component: SelectionChip,
  parameters: { reference: { screenshot: '05-about-your-business-2.png', note: 'AI-generated customer chips + free text', role: 'chip' } },
} satisfies Meta<typeof SelectionChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Local surfers', selected: false, onToggle: () => {} } };
export const Selected: Story = { args: { label: 'Local surfers', selected: true, onToggle: () => {} } };

export const MultiSelectWithFreeText: StoryObj = {
  name: 'Group — multi-select + free text (screen 4/6)',
  render: () => {
    const [value, setValue] = useState<string[]>(['Local surfers']);
    const [other, setOther] = useState('');
    return <ChipGroup label="Who are Swell Salt's customers?" options={CUSTOMERS} value={value} onChange={setValue} freeText={{ value: other, onChange: setOther }} />;
  },
};

export const MultiSelectChannels: StoryObj = {
  name: 'Group — multi-select (screen 5/6)',
  parameters: { reference: { screenshot: '06-about-your-business-3.png' } },
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return <ChipGroup label="How do customers get your surf gear and lessons?" options={CHANNELS} value={value} onChange={setValue} />;
  },
};

export const SingleSelect: StoryObj = {
  name: 'Group — single-select',
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return <ChipGroup mode="single" label="Channel" options={CHANNELS} value={value} onChange={setValue} />;
  },
};
