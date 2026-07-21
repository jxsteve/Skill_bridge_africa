import { PropsWithChildren, useEffect, useState } from 'react';

import styles from './PhoneFrame.module.css';
import { StatusBar } from './StatusBar';

/** Viewports at least this wide get the desktop phone frame. */
const FRAME_MIN_WIDTH = 520;

export function useFramed() {
  const [framed, setFramed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= FRAME_MIN_WIDTH,
  );
  useEffect(() => {
    const onResize = () => setFramed(window.innerWidth >= FRAME_MIN_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return framed;
}

/**
 * Wraps the app in a fixed phone-sized frame on desktop and lets it fill the
 * screen on phone-sized viewports.
 */
export default function PhoneFrame({ children }: PropsWithChildren) {
  const framed = useFramed();

  if (!framed) {
    return (
      <div className={styles.fullBleed}>
        <StatusBar />
        <div className={styles.fullBleedBody}>{children}</div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.frame}>
        <StatusBar />
        <div className={styles.frameBody}>{children}</div>
      </div>
    </div>
  );
}
