import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  args: { label: 'What does your business do?', hideLabel: true },
  parameters: { reference: { screenshot: '03-business-activity.png', note: '2/6 free text', role: 'input' } },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BusinessActivity: Story = { args: { helper: 'Plain English — a few words is plenty' } };
export const Filled: Story = { args: { helper: 'Plain English — a few words is plenty', defaultValue: 'Surf shop selling surfboards, wetsuits and surf lessons' } };
export const BusinessName: Story = { args: { label: 'Business name', defaultValue: 'Swell & Salt Surf Co.' }, parameters: { reference: { screenshot: '00-home.png' } } };
export const PhoneWithPrefix: Story = { name: 'Phone (+1 prefix, observed)', args: { label: 'Phone', hideLabel: false, prefix: '+1', type: 'tel' }, parameters: { reference: { screenshot: '13-registration.png' } } };
export const Password: Story = { args: { label: 'Password', hideLabel: false, type: 'password', helper: 'At least 6 characters' }, parameters: { reference: { screenshot: '13-registration__modal.png' } } };
export const ErrorUnknown: Story = { name: 'Error — UNKNOWN styling', args: { label: 'Email', hideLabel: false, error: 'Error state not observed on the live site' } };
