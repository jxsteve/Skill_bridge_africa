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
  deadline: string;
  onBack: () => void;
  onGoBackToDashboard: () => void;
  onCardClick: () => void;
};

export default function TaskInProgressScreen({
  student,
  deadline,
  onBack,
  onGoBackToDashboard,
  onCardClick,
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

        <section className={styles.card}
          onClick={onCardClick}
          style={{ cursor: 'pointer' }}
        >
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