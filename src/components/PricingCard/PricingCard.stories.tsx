import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingCard } from './PricingCard';

const meta = { title: 'Components/PricingCard', component: PricingCard } satisfies Meta<typeof PricingCard>;
export default meta;

export const Plans: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      <PricingCard name="Basic" price="$0" features={['Feature one', 'Feature two']} ctaLabel="Choose" />
      <PricingCard name="Plus" price="$12" period="/mo" badge="Most popular" highlighted features={['Everything in Basic', 'Feature three', 'Feature four']} ctaLabel="Choose" />
      <PricingCard name="Pro" price="$29" period="/mo" features={['Everything in Plus', 'Feature five']} ctaLabel="Choose" />
    </div>
  ),
};
