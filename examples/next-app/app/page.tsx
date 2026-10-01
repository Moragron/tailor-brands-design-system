import Link from 'next/link';
import { QuestionStep } from './question-step';

// Server component: renders a client step; design-system components can also render here directly.
export default function Page() {
  return (
    <>
      <QuestionStep />
      <nav className="fixed bottom-4 left-4 text-tb-caption">
        <Link className="underline text-tb-text-muted" href="/results">
          Gated results page →
        </Link>
      </nav>
    </>
  );
}
