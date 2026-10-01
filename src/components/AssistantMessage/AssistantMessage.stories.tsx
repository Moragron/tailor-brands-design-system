import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssistantMessage } from './AssistantMessage';

const meta = { title: 'Components/AssistantMessage', component: AssistantMessage } satisfies Meta<typeof AssistantMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Thinking: Story = { args: { thinking: true, thinkingLabel: 'Thinking' } };
export const Message: Story = { args: { children: <p>A friendly, first-person message goes here.</p> } };
