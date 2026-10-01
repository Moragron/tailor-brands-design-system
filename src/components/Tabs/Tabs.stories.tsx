import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupedList, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    tabs: [
      { id: 'one', label: 'First', content: <GroupedList groups={[{ heading: 'Group A', items: ['Item one', 'Item two'] }, { heading: 'Group B', items: ['Item three'] }]} /> },
      { id: 'two', label: 'Second', content: <p className="tb-body">Second panel.</p> },
      { id: 'three', label: 'Third', content: <p className="tb-body">Third panel.</p> },
    ],
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
