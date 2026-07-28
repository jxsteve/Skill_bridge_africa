import { FileClockIcon, PrimaryButton } from '../components/ui';
import styles from './TaskUnderReviewScreen.module.css';

type Props = {
  onViewMyTasks: () => void;
};

export default function TaskUnderReviewScreen({ onViewMyTasks }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconCircle}>
          <FileClockIcon size={44} color="var(--primary-blue)" />
        </div>

        <p className={styles.title}>Task Under Review</p>
        <p className={styles.subtitle}>
          Our Admin team is reviewing your task requirements
          <br />
          You will be notified once a suitable student has been assigned
        </p>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton
            label="View My Tasks"
            showIcon={false}
            fullWidth
            onClick={onViewMyTasks}
          />
        </div>
      </div>
    </div>
  );
}