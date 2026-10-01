import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressStepper } from './ProgressStepper';

const meta = { title: 'Components/ProgressStepper', component: ProgressStepper } satisfies Meta<typeof ProgressStepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fraction: Story = { args: { current: 2, total: 5 } };
export const Sections: Story = { args: { variant: 'sections', sections: ['Details', 'Options', 'Review'], activeIndex: 1 } };
