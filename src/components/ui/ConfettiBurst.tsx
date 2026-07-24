import type { ReactNode } from 'react';
import styles from './CelebrationCheck.module.css';

const CONFETTI = [
  { top: '4%', left: '30%', rotate: '-20deg', color: '#FDE68A' },
  { top: '2%', left: '62%', rotate: '15deg', color: '#BFDBFE' },
  { top: '14%', left: '10%', rotate: '35deg', color: '#FDE68A' },
  { top: '16%', left: '82%', rotate: '-30deg', color: '#86EFAC' },
  { top: '32%', left: '4%', rotate: '10deg', color: '#FDA4AF' },
  { top: '34%', left: '90%', rotate: '-10deg', color: '#FDE68A' },
  { top: '46%', left: '14%', rotate: '-25deg', color: '#86EFAC' },
  { top: '48%', left: '80%', rotate: '20deg', color: '#86EFAC' },
];

type Props = {
  children: ReactNode;
};

/**
 * ConfettiBurst
 * The scattered confetti-pill background used on celebration/success
 * screens. Wrap any centered icon/graphic in this to get the same burst.
 * `CelebrationCheck` is a convenience wrapper around this for the common
 * "green circle + checkmark" case — use ConfettiBurst directly when you
 * need a different icon (e.g. Payment Released's wallet icon).
 */
export function ConfettiBurst({ children }: Props) {
  return (
    <div className={styles.wrap}>
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className={styles.confetti}
          style={{
            top: c.top,
            left: c.left,
            backgroundColor: c.color,
            transform: `rotate(${c.rotate})`,
          }}
        />
      ))}
      {children}
    </div>
  );
}