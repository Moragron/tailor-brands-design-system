import { FlowLayout, GatedContent, RegistrationModal, TimelineList, TimelineTabs } from 'tailor-brands-design-system';

// Server components can render the design system directly when no state is needed here.
export default function PlanPage() {
  return (
    <GatedContent locked gate={<RegistrationModal ctaLabel="Continue" />}>
      <FlowLayout>
        <p className="tb-caption">I know it can be overwhelming sometimes</p>
        <h1 className="tb-h1">Your Custom Launch Plan is Ready</h1>
        <TimelineTabs
          tabs={[
            {
              id: 'week',
              label: 'This week',
              content: (
                <TimelineList
                  groups={[
                    { heading: 'Today', items: ['Submit LLC', 'Permits', 'Registered agent'] },
                    { heading: 'Once formed', items: ['EIN', 'Bank account', 'Payments', 'Bookkeeping'] },
                  ]}
                />
              ),
            },
            { id: 'quarterly', label: 'Quarterly', content: <p className="tb-body">Available after registration.</p> },
            { id: 'yearly', label: 'Yearly', content: <p className="tb-body">Available after registration.</p> },
          ]}
        />
      </FlowLayout>
    </GatedContent>
  );
}
