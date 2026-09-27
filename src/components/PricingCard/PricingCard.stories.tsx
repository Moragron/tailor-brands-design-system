import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingCard } from './PricingCard';

const meta = {
  title: 'Components/PricingCard',
  component: PricingCard,
  parameters: { reference: { screenshot: '00-home.png', note: 'Homepage pricing (lower priority than the flow)' } },
} satisfies Meta<typeof PricingCard>;
export default meta;

// Plan facts verbatim from onboarding-flow-notes.md.
export const Plans: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      <PricingCard name="Lite" price="$0" priceNote="+ state fees" features={['14 business days processing', '30-day bookkeeping trial']} />
      <PricingCard name="Essential" price="$199" period="/yr" badge="POPULAR" highlighted features={['$30 Amazon gift card', '1-day expedited', '30-day bookkeeping trial']} />
      <PricingCard name="Elite" price="$249" period="/yr" features={['$50 Amazon gift card', 'Domain + website', '30-day bookkeeping trial']} />
    </div>
  ),
};
