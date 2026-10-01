import type { Meta, StoryObj } from '@storybook/react-vite';
import { PercentLoader, useSimulatedProgress, type LoaderMessage } from './PercentLoader';

const MESSAGES: LoaderMessage[] = [{ text: 'First status message' }, { text: 'Second status message', source: 'secondary detail' }, { text: 'Final status message' }];

const meta = { title: 'Components/PercentLoader', component: PercentLoader, args: { label: 'Progress', percent: 42 } } satisfies Meta<typeof PercentLoader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = { args: { message: MESSAGES[1] } };
export const Animated: StoryObj = {
  render: () => {
    const { percent, message } = useSimulatedProgress(MESSAGES, 8000);
    return <PercentLoader label="Progress" percent={percent} message={message} />;
  },
};
