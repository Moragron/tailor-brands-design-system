import { useEffect, useState } from 'react';
import './PercentLoader.css';

export type LoaderMessage = { text: string; /** e.g. "bls.gov" or a document name shown under the status */ source?: string };

export type PercentLoaderProps = {
  percent: number;
  headline?: string;
  message?: LoaderMessage;
};

/** "Labor illusion" loader on /scanning: % counter + rotating status line with a source. */
export function PercentLoader({ percent, headline, message }: PercentLoaderProps) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="tb-loader">
      {headline && <h1 className="tb-h2">{headline}</h1>}
      <div className="tb-loader__percent" aria-hidden>{p}%</div>
      <div className="tb-loader__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} aria-label="Scanning progress">
        <div className="tb-loader__fill" style={{ width: `${p}%` }} />
      </div>
      {message && (
        <div className="tb-loader__status" aria-live="polite">
          <p className="tb-body">{message.text}</p>
          {message.source && <p className="tb-caption">{message.source}</p>}
        </div>
      )}
    </div>
  );
}

/** Drives percent 0→100 over `durationMs` (observed ≈15s) and rotates messages evenly across it. */
export function useSimulatedProgress(messages: LoaderMessage[], durationMs = 15000, onDone?: () => void) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const e = Math.min(t - start, durationMs);
      setElapsed(e);
      if (e < durationMs) raf = requestAnimationFrame(tick);
      else onDone?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]); // eslint-disable-line react-hooks/exhaustive-deps
  const percent = (elapsed / durationMs) * 100;
  const message = messages[Math.min(messages.length - 1, Math.floor((elapsed / durationMs) * messages.length))];
  return { percent, message };
}
