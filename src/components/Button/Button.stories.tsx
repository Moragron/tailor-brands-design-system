import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Next', variant: 'primary' },
  parameters: { reference: { screenshot: '02-business-state.png', note: 'Next — disabled until a state is chosen', role: 'primaryButtonDisabled' } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { parameters: { reference: { screenshot: '03-business-activity.png', role: 'primaryButton' } } };
export const PrimaryDisabled: Story = { name: 'Primary — disabled (observed)', args: { disabled: true } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Skip' } };
export const Remove: Story = { name: 'Secondary — Remove', args: { variant: 'secondary', children: 'Remove' }, parameters: { reference: { screenshot: '11-liability.png' } } };
export const Start: Story = { args: { children: 'Start' }, parameters: { reference: { screenshot: '00-home.png' } } };
