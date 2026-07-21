import { useEffect } from 'react';

import logoMark from '../assets/images/logo_mark.png';
import styles from './SplashScreen.module.css';

const SPLASH_MS = 2800;

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.container}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.glow} />
      <div className={styles.content}>
        <img src={logoMark} className={styles.logo} alt="SkillBridge" />
        <p className={styles.wordmark}>
          <span className={styles.skill}>Skill</span>
          <span className={styles.bridge}>Bridge</span>
        </p>
        <p className={styles.africa}>–AFRICA–</p>
        <p className={styles.tagline}>Your Skills. Our Bridge</p>
      </div>
    </div>
  );
}
