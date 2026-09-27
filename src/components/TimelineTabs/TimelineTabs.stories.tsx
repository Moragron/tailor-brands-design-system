import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimelineTabs } from './TimelineTabs';
import { LAUNCH_PLAN_TABS } from '../../data/flowContent';


const meta = {
  title: 'Components/TimelineTabs',
  component: TimelineTabs,
  args: { tabs: LAUNCH_PLAN_TABS },
  parameters: { reference: { screenshot: '13-registration.png', note: 'Seen blurred behind the modal' } },
} satisfies Meta<typeof TimelineTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LaunchPlan: Story = {};
export const QuarterlySelected: Story = { args: { defaultTab: 'quarterly' } };
