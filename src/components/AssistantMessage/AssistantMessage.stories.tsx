import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssistantMessage } from './AssistantMessage';

const meta = {
  title: 'Components/AssistantMessage',
  component: AssistantMessage,
  parameters: { reference: { screenshot: '10-entity__arrival.png', note: '"Thinking" state then personalised copy' } },
} satisfies Meta<typeof AssistantMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Thinking: Story = { args: { thinking: true } };
export const Personalised: Story = {
  args: {
    children: (
      <p>
        …focus on serving surfers with boards, wetsuits and lessons knowing your home and personal savings are protected…
        California LLC is best fit.
      </p>
    ),
  },
};
export const IntroPersona: Story = {
  parameters: { reference: { screenshot: '01-intro.png' } },
  args: { children: <p>I’m so happy you’re starting this journey… I’ll handle the paperwork.</p> },
};
