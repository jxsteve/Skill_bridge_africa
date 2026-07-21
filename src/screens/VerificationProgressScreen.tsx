import { useEffect } from 'react';

import styles from './VerificationProgressScreen.module.css';

const VERIFY_DURATION_MS = 6000;

type Props = {
  onDone: () => void;
};

/** Shown while the account is "being verified"; auto-advances after 6s. */
export default function VerificationProgressScreen({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, VERIFY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrap}>
        <div className={styles.ringTrack} />
        <div className={styles.ring} />
      </div>
      <span className={styles.title}>Verification in progress</span>
      <p className={styles.message}>
        We&rsquo;re verifying your student details and setting up your dedicated
        wallet. This will only take a moment&hellip;
      </p>
    </div>
  );
}
