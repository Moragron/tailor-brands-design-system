import type { Meta, StoryObj } from '@storybook/react-vite';
import { RegistrationModal } from './RegistrationModal';
import { GatedContent } from '../Modal/Modal';

const meta = {
  title: 'Components/RegistrationModal',
  component: RegistrationModal,
  parameters: { reference: { screenshot: '13-registration.png', note: 'Registration gate', role: 'modal' } },
  decorators: [(Story) => <GatedContent locked gate={<Story />}><div /></GatedContent>],
} satisfies Meta<typeof RegistrationModal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AsObserved: Story = {
  name: 'As observed — "Sign up" copy vs "Continue" button',
  args: { ctaLabel: 'Continue', legalCtaLabel: 'Sign up' },
};
export const CopyFixed: Story = {
  name: 'Fixed — legal copy derived from button label',
  args: { ctaLabel: 'Continue' },
};
