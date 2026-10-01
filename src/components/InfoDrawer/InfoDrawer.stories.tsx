import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoDrawer } from './InfoDrawer';

const meta = {
  title: 'Components/InfoDrawer',
  component: InfoDrawer,
  args: { triggerLabel: 'Learn more', sections: [{ heading: 'Heading', body: 'Body text.' }, { heading: 'Another heading', body: 'Body text.' }] },
} satisfies Meta<typeof InfoDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
