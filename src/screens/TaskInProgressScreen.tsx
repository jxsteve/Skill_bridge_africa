import { ChevronLeftIcon, PrimaryButton, UserIcon } from '../components/ui';
import styles from './TaskInProgressScreen.module.css';

export type TaskInProgressStudent = {
  name: string;
  role: string;
  online: boolean;
  avatarUrl?: string;
};

type Props = {
  student: TaskInProgressStudent;
  progressPercent: number;
  deadline: string;
  onBack: () => void;
  onGoBackToDashboard: () => void;
};

export default function TaskInProgressScreen({
  student,
  progressPercent,
  deadline,
  onBack,
  onGoBackToDashboard,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={24} />
          </button>
          <p className={styles.title}>Task in Progress</p>
        </header>

        <section className={styles.card}>
          <div className={styles.studentRow}>
            <div className={styles.avatar}>
              {student.avatarUrl ? (
                <img className={styles.avatarImage} src={student.avatarUrl} alt="" />
              ) : (
                <UserIcon size={26} color="#111827" />
              )}
            </div>
            <div className={styles.studentInfo}>
              <p className={styles.studentName}>{student.name}</p>
              <p className={styles.studentRole}>{student.role}</p>
            </div>
            {student.online && (
              <span className={styles.onlineBadge}>
                <span className={styles.onlineDot} />
                Online
              </span>
            )}
          </div>

          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>Progress</p>
            <p className={styles.progressText}>{progressPercent}% completed</p>
            <div className={styles.progressBarRow}>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={styles.progressPercentLabel}>{progressPercent}%</span>
            </div>
          </div>

          <div className={`${styles.sectionRow} ${styles.sectionRowLast}`}>
            <p className={styles.sectionLabel}>Deadline</p>
            <p className={styles.deadlineText}>{deadline}</p>
          </div>
        </section>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton
            label="Go Back to Dashboard"
            showIcon={false}
            fullWidth
            onClick={onGoBackToDashboard}
          />
        </div>
      </div>
    </div>
  );
}