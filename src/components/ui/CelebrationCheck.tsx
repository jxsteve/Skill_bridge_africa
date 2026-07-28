import { CheckIcon } from './icons';
import { ConfettiBurst } from './ConfettiBurst';
import styles from './CelebrationCheck.module.css';

type Props = {
  size?: number;
};

/**
 * CelebrationCheck
 * A green checkmark circle surrounded by scattered confetti pills.
 * Used on success/completion screens (Verification Completed, Student
 * Assigned, Work Submitted, Work Approved, etc).
 * For a different icon (no circle border), use ConfettiBurst directly.
 */
export function CelebrationCheck({ size = 132 }: Props) {
  return (
    <ConfettiBurst>
      <div className={styles.circle} style={{ width: size, height: size }}>
        <CheckIcon size={size * 0.42} color="#16A34A" strokeWidth={3} />
      </div>
    </ConfettiBurst>
  );
}