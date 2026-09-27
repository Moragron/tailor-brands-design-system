import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoDrawer } from './InfoDrawer';
import { NOT_CAPTURED } from '../../data/notCaptured';

const meta = {
  title: 'Components/InfoDrawer',
  component: InfoDrawer,
  args: {
    sections: [
      { heading: 'What', body: NOT_CAPTURED },
      { heading: 'Why important', body: NOT_CAPTURED },
      { heading: 'What we do', body: NOT_CAPTURED },
    ],
  },
  parameters: { reference: { screenshot: '11-liability__drawer-open.png', note: '"What is it" on a Liability Suite item', role: 'drawer' } },
} satisfies Meta<typeof InfoDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
