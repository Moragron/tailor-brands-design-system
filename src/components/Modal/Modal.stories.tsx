import type { Meta, StoryObj } from '@storybook/react-vite';
import { GatedContent, Modal } from './Modal';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { reference: { screenshot: '13-registration.png', note: 'Blurred report behind registration modal' } },
} satisfies Meta<typeof Modal>;
export default meta;

const Teaser = () => (
  <div style={{ display: 'grid', gap: 12, padding: 24 }}>
    <h1 className="tb-h1">Your Custom Launch Plan is Ready</h1>
    {Array.from({ length: 8 }, (_, i) => <p key={i} className="tb-body">Plan line {i + 1}</p>)}
  </div>
);

export const OverBlurredContent: StoryObj = {
  name: 'Over blurred content (observed pattern)',
  render: () => (
    <GatedContent locked gate={<Modal open title="Register to access your business report for free."><Button fullWidth>Continue</Button></Modal>}>
      <Teaser />
    </GatedContent>
  ),
};
export const WithCloseUnknown: StoryObj = {
  name: 'With close button (UNKNOWN whether live gate has one)',
  render: () => (
    <GatedContent locked gate={<Modal open title="Modal title" onClose={() => {}}><Button fullWidth>Continue</Button></Modal>}>
      <Teaser />
    </GatedContent>
  ),
};
