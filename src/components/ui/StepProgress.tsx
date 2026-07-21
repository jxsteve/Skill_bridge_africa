import styles from './StepProgress.module.css';

type Props = {
  step: number;
  totalSteps: number;
};

export function StepProgress({ step, totalSteps }: Props) {
  return (
    <div>
      <p className={styles.label}>
        Step {step} of {totalSteps}
      </p>
      <div className={styles.track}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`${styles.segment} ${i < step ? styles.done : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
