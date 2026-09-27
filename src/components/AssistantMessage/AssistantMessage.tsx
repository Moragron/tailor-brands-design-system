import type { ReactNode } from 'react';
import './AssistantMessage.css';

export type AssistantMessageProps = {
  /** Observed: a "Thinking" state precedes the personalised copy on /entity */
  thinking?: boolean;
  children?: ReactNode;
};

/** First-person AI persona copy ("I'm so happy you're starting this journey…"). */
export function AssistantMessage({ thinking, children }: AssistantMessageProps) {
  return (
    <div className="tb-assistant" aria-live="polite" aria-busy={thinking || undefined}>
      {thinking ? (
        <span className="tb-assistant__thinking">Thinking<span aria-hidden className="tb-assistant__dots"><i>.</i><i>.</i><i>.</i></span></span>
      ) : children}
    </div>
  );
}
