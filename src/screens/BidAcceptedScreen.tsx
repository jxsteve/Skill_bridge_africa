import { CheckIcon, PrimaryButton } from '../components/ui';
import { Task } from '../data/marketplace';
import styles from './BidAcceptedScreen.module.css';

type Props = {
  task: Task;
  onGoToTask: () => void;
  onViewProjects: () => void;
};

// Small confetti specks scattered around the success ring.
const CONFETTI = [
  { x: 24, y: 40, c: '#F5C84B' },
  { x: 300, y: 30, c: '#93F0B6' },
  { x: 60, y: 120, c: '#F28B82' },
  { x: 320, y: 110, c: '#8AB4F8' },
  { x: 20, y: 150, c: '#F5C84B' },
  { x: 340, y: 160, c: '#93F0B6' },
  { x: 120, y: 20, c: '#8AB4F8' },
  { x: 250, y: 150, c: '#F5C84B' },
];

export default function BidAcceptedScreen({ task, onGoToTask, onViewProjects }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.celebration}>
          <svg
            className={styles.confetti}
            width={360}
            height={200}
            viewBox="0 0 360 200"
          >
            {CONFETTI.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={7} fill={c.c} opacity={0.85} />
            ))}
          </svg>
          <div className={styles.ringOuter}>
            <div className={styles.ringInner}>
              <CheckIcon size={48} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <p className={styles.title}>Congratulations!</p>
        <p className={styles.subtitle}>Your Bid has been accepted</p>

        <div className={styles.card}>
          <p className={styles.cardTitle}>{task.title}</p>
          <p className={styles.cardClient}>{task.client}</p>
          <div className={styles.cardRow}>
            <div>
              <p className={styles.cardLabel}>Budget</p>
              <p className={styles.cardValue}>${task.budget.toFixed(2)}</p>
            </div>
            <div className={styles.cardRight}>
              <p className={styles.cardLabel}>Due date</p>
              <p className={styles.cardValue}>{task.dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      <PrimaryButton label="Go to Task" showIcon={false} fullWidth onClick={onGoToTask} />
      <button className={styles.viewAll} onClick={onViewProjects}>
        <span className={styles.viewAllText}>View all Projects</span>
      </button>
    </div>
  );
}
