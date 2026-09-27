import type { Meta, StoryObj } from '@storybook/react-vite';
import { PercentLoader, useSimulatedProgress } from './PercentLoader';
import { SCANNING_MESSAGES } from '../../data/flowContent';


const meta = {
  title: 'Components/PercentLoader',
  component: PercentLoader,
  parameters: { reference: { screenshot: '08-scanning__t6s.png', note: '/scanning, ~15s' } },
} satisfies Meta<typeof PercentLoader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = { args: { percent: 42, message: SCANNING_MESSAGES[1] } };
export const Animated: StoryObj = {
  name: 'Animated (15s, rotating status — observed timing)',
  render: () => {
    const { percent, message } = useSimulatedProgress(SCANNING_MESSAGES, 15000);
    return <PercentLoader percent={percent} message={message} />;
  },
};
