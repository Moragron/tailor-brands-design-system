import Link from 'next/link';
import { CustomersStep } from './customers-step';

// Server component: passes data down; the design system components are client components.
export default function Page() {
  return (
    <>
      <CustomersStep businessName="Swell & Salt Surf Co." />
      <nav className="fixed bottom-4 left-4 text-tb-caption">
        <Link className="underline text-tb-text-muted" href="/plan">
          See the plan + registration gate →
        </Link>
      </nav>
    </>
  );
}
