import { TimelineList } from '../components/TimelineTabs/TimelineTabs';
import type { LoaderMessage } from '../components/PercentLoader/PercentLoader';
import { NOT_CAPTURED } from './notCaptured';

// Verbatim from onboarding-flow-notes.md, screen 8.
export const SCANNING_MESSAGES: LoaderMessage[] = [
  { text: 'Let me read some stuff so you won’t have to' },
  { text: 'Scanning California regulations for your industry...', source: 'bls.gov' },
  { text: 'Reviewing privacy & liability protections...', source: 'swell-salt-surf-co-privacy-policy-C.docx' },
];

// Items verbatim (abbreviated) from onboarding-flow-notes.md, screen 13.
export const LAUNCH_PLAN_TABS = [
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
  { id: 'quarterly', label: 'Quarterly', content: <p>{NOT_CAPTURED} — only reachable after registration.</p> },
  { id: 'yearly', label: 'Yearly', content: <p>{NOT_CAPTURED} — only reachable after registration.</p> },
];

