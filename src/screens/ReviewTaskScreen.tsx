import { ChevronLeftIcon, PrimaryButton } from '../components/ui';
import type { NewTaskDetails } from './CreateTaskScreen';
import styles from './ReviewTaskScreen.module.css';

type Props = {
  task: NewTaskDetails;
  onBack: () => void;
  onEdit: () => void;
  onSubmit: () => void;
};

function formatDeadline(deadline: string) {
  const date = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReviewTaskScreen({ task, onBack, onEdit, onSubmit }: Props) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Title', value: task.title },
    { label: 'Category', value: task.category },
    { label: 'Skils', value: task.skills.join(', ') },
    { label: 'Budget', value: `$${task.budget}` },
    { label: 'Deadline', value: formatDeadline(task.deadline) },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={24} />
          </button>
          <p className={styles.title}>Review Task</p>
        </header>

        <p className={styles.sectionLabel}>Task Details</p>

        <section className={styles.detailsCard}>
          {rows.map((row) => (
            <div key={row.label} className={styles.detailRow}>
              <span className={styles.detailLabel}>{row.label}</span>
              <span className={styles.detailValue}>{row.value}</span>
            </div>
          ))}
          <div className={`${styles.detailRow} ${styles.detailRowLast}`}>
            <span className={styles.detailLabel}>Description</span>
            <p className={styles.detailDescription}>{task.description}</p>
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.editButton} onClick={onEdit}>
            Edit
          </button>
          <div className={styles.submitButton}>
            <PrimaryButton label="Submit Task" showIcon={false} fullWidth onClick={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}