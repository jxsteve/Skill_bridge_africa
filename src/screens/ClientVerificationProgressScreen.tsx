import { useEffect, useState } from 'react';

import { CheckIcon, ClockIcon } from '../components/ui';
import styles from './ClientVerificationProgressScreen.module.css';

export type VerificationStepConfig = {
  label: string;
  /** The progress % at which this step flips from Pending to Done. */
  threshold: number;
  /** Shown once the step is done. */
  completedTimestamp: string;
};

type Props = {
  progress?: number;
  steps?: VerificationStepConfig[];
  onDone: () => void;
};

const DEFAULT_STEPS: VerificationStepConfig[] = [
  { label: 'Payment received', threshold: 0, completedTimestamp: '10:24 AM' },
  { label: 'Confirming on blockchain', threshold: 40, completedTimestamp: '10:26 AM' },
  { label: 'Activating your account', threshold: 70, completedTimestamp: '10:28 AM' },
  { label: 'Wallet will be active', threshold: 100, completedTimestamp: '10:30 AM' },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ClientVerificationProgressScreen({
  progress = 25,
  steps = DEFAULT_STEPS,
  onDone,
}: Props) {
  const [displayProgress, setDisplayProgress] = useState(progress);

  // Simulate the verification advancing over time. Replace this with a real
  // status poll/subscription once the backend verification endpoint exists.
  // Each checklist item's `threshold` decides when it flips to "done" as
  // displayProgress climbs, so the ring and the checklist stay in sync.
  useEffect(() => {
    if (displayProgress >= 100) {
      const timeout = setTimeout(onDone, 600);
      return () => clearTimeout(timeout);
    }
    const timer = setTimeout(() => setDisplayProgress((p) => Math.min(100, p + 15)), 900);
    return () => clearTimeout(timer);
  }, [displayProgress, onDone]);

  const offset = CIRCUMFERENCE - (displayProgress / 100) * CIRCUMFERENCE;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.pageTitle}>Verification in Progress</p>

        <div className={styles.ringWrap}>
          <svg width={128} height={128} viewBox="0 0 128 128">
            <circle
              cx={64}
              cy={64}
              r={RADIUS}
              fill="none"
              stroke="var(--blue-50)"
              strokeWidth={10}
            />
            <circle
              cx={64}
              cy={64}
              r={RADIUS}
              fill="none"
              stroke="var(--primary-blue)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 64 64)"
              className={styles.ringProgress}
            />
          </svg>
          <span className={styles.ringLabel}>{displayProgress} %</span>
        </div>

        <p className={styles.title}>We're Verifying your wallet</p>
        <p className={styles.subtitle}>
          please allow a few minutes while we verify your payment on the blockchain.
        </p>

        <div className={styles.stepCard}>
          <ul className={styles.stepList}>
            {steps.map((step, index) => {
              const isDone = displayProgress >= step.threshold;
              return (
                <li key={step.label} className={styles.stepRow}>
                  <span className={styles.stepIndicatorCol}>
                    <span
                      className={`${styles.stepIndicator} ${
                        isDone ? styles.stepIndicatorDone : styles.stepIndicatorPending
                      }`}
                    >
                      {isDone && (
                        <CheckIcon size={11} strokeWidth={3} color="var(--brand-green)" />
                      )}
                    </span>
                    {index < steps.length - 1 && <span className={styles.stepConnector} />}
                  </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <span
                    className={`${styles.stepTimestamp} ${
                      !isDone ? styles.stepTimestampPending : ''
                    }`}
                  >
                    {isDone ? step.completedTimestamp : 'Pending'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.infoBanner}>
          <ClockIcon size={16} />
          <span>you will be notified once verification is completed</span>
        </div>
      </div>
    </div>
  );
}