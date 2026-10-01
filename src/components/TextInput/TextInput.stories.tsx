import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta = { title: 'Components/TextInput', component: TextInput, args: { label: 'Label', placeholder: 'Placeholder' } } satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelper: Story = { args: { helper: 'Helper text' } };
export const WithPrefix: Story = { args: { label: 'Amount', prefix: '$', placeholder: '0.00' } };
export const Password: Story = { args: { label: 'Password', type: 'password', helper: 'At least 8 characters' } };
export const Error: Story = { args: { error: 'Error message' } };
export const HiddenLabel: Story = { args: { hideLabel: true } };
