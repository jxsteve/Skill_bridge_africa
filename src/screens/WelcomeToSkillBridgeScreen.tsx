import { useEffect } from 'react';

import logoMark from '../assets/images/logo_mark.png';
import styles from './WelcomeToSkillBridgeScreen.module.css';

const HOLD_MS = 2400;

type Props = {
  name?: string;
  onDone: () => void;
};

/** Brief celebratory interstitial shown after verification. */
export default function WelcomeToSkillBridgeScreen({ name, onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, HOLD_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  const firstName = name?.trim().split(' ')[0];

  return (
    <div className={styles.container}>
      <img src={logoMark} className={styles.logoMark} alt="SkillBridge" />
      <div className={styles.textWrap}>
        <span className={styles.welcome}>Welcome to</span>
        <span className={styles.wordmark}>
          <span className={styles.skill}>Skill</span>
          <span className={styles.bridge}>Bridge</span>
        </span>
        <span className={styles.subtitle}>
          {firstName ? `Great to have you, ${firstName}.` : 'Great to have you.'}
        </span>
      </div>
    </div>
  );
}
