import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingFlow, STEPS, type Step } from './OnboardingFlow';

const meta = {
  title: 'Onboarding flow/Screens',
  component: OnboardingFlow,
  parameters: { layout: 'fullscreen' },
  argTypes: { initialStep: { control: 'select', options: STEPS } },
  args: { reproduceNameBug: true, reproduceCopyMismatch: true, preAddSuites: true, scanMs: 15000 },
} satisfies Meta<typeof OnboardingFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

const screen = (initialStep: Step, screenshot: string): Story => ({
  args: { initialStep },
  parameters: { reference: { screenshot } },
});

export const ClickThrough: Story = { name: '▶ Full flow (click-through prototype)', args: { initialStep: 'home' }, parameters: { reference: null } };
export const S00Home: Story = { ...screen('home', '00-home.png'), name: 'S00 Home' };
export const S01Intro: Story = { ...screen('intro', '01-intro.png'), name: 'S01 Intro' };
export const S02BusinessState: Story = { ...screen('business-state', '02-business-state.png'), name: 'S02 Business State' };
export const S03BusinessActivity: Story = { ...screen('business-activity', '03-business-activity.png'), name: 'S03 Business Activity' };
export const S04Owners: Story = { ...screen('about-your-business-1', '04-about-your-business-1.png'), name: 'S04 Owners (name bug reproduced)' };
export const S04OwnersFixed: Story = { name: 'S04 Owners — name bug fixed', args: { initialStep: 'about-your-business-1', reproduceNameBug: false }, parameters: { reference: null } };
export const S05Customers: Story = { ...screen('about-your-business-2', '05-about-your-business-2.png'), name: 'S05 Customers' };
export const S06Channels: Story = { ...screen('about-your-business-3', '06-about-your-business-3.png'), name: 'S06 Channels' };
export const S07Revenue: Story = { ...screen('business-expenses', '07-business-expenses.png'), name: 'S07 Revenue' };
export const S08Scanning: Story = { ...screen('scanning', '08-scanning__t6s.png'), name: 'S08 Scanning' };
export const S09Blueprint: Story = { ...screen('blueprint', '09-blueprint.png'), name: 'S09 Blueprint' };
export const S10Entity: Story = { ...screen('entity', '10-entity.png'), name: 'S10 Entity' };
export const S11Liability: Story = { ...screen('liability', '11-liability.png'), name: 'S11 Liability' };
export const S11LiabilityOptIn: Story = { name: 'S11 Liability — opt-in variant (growth test)', args: { initialStep: 'liability', preAddSuites: false }, parameters: { reference: null } };
export const S12Branding: Story = { ...screen('branding', '12-branding.png'), name: 'S12 Branding' };
export const S13Registration: Story = { ...screen('registration', '13-registration.png'), name: 'S13 Registration' };
export const S13RegistrationFixed: Story = { name: 'S13 Registration — copy mismatch fixed', args: { initialStep: 'registration', reproduceCopyMismatch: false }, parameters: { reference: null } };
