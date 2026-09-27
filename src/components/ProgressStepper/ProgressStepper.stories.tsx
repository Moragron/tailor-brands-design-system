import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressStepper } from './ProgressStepper';

const meta = {
  title: 'Components/ProgressStepper',
  component: ProgressStepper,
  parameters: { reference: { screenshot: '02-business-state.png', note: '"1/6" counter', role: 'stepCounter' } },
} satisfies Meta<typeof ProgressStepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fraction: Story = { args: { current: 1, total: 6 } };
export const FractionLast: Story = { args: { current: 6, total: 6 }, parameters: { reference: { screenshot: '07-business-expenses.png' } } };
export const Sections: Story = {
  args: { variant: 'sections', sections: ['Entity', 'Liability', 'Branding'], activeIndex: 1 },
  parameters: { reference: { screenshot: '11-liability.png', note: 'Entity / Liability / Branding nav', role: 'sectionNav' } },
};
