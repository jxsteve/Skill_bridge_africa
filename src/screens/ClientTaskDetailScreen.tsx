/**
 * Client task detail — the single, status-driven view of one of the client's
 * tasks. It reflects the REAL project lifecycle (waiting for admin → student
 * assigned → work submitted → admin approved → ready for review → completed)
 * instead of a scripted click-through, so it stays in sync with the student and
 * admin dashboards.
 */
import {
  BackButton,
  BottomNav,
  CheckCircleIcon,
  DownloadIcon,
  FileIcon,
  PrimaryButton,
  UserIcon,
  type MainTab,
} from '../components/ui';
import type { ClientTaskDetail } from '../data/marketplace-service';
import styles from './ClientTaskDetailScreen.module.css';

type Props = {
  detail: ClientTaskDetail;
  onBack: () => void;
  onReview: () => void;
  onTab: (tab: MainTab) => void;
};

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

// The five lifecycle milestones the client tracks.
const STEPS = ['Created', 'Student assigned', 'Work submitted', 'Admin approved', 'Completed'];

function currentStep(detail: ClientTaskDetail): number {
  const p = detail.project;
  if (!p) return 0; // task created, waiting for admin to assign
  if (p.status === 'completed' || p.paymentStatus === 'released') return 4;
  if (p.status === 'approved') return 3;
  if (p.status === 'under_review' || p.status === 'submitted' || detail.submission) return 2;
  return 1; // assigned / in_progress
}

function statusMessage(detail: ClientTaskDetail): { title: string; body: string; tone: 'wait' | 'action' | 'done' } {
  const step = currentStep(detail);
  switch (step) {
    case 0:
      return {
        title: 'Waiting for admin review',
        body:
          detail.applicantCount > 0
            ? `${detail.applicantCount} student${detail.applicantCount > 1 ? 's have' : ' has'} requested this task. An admin will review the bids and assign the best fit.`
            : 'An admin will review this task and assign a verified student shortly.',
        tone: 'wait',
      };
    case 1:
      return {
        title: 'Work in progress',
        body: `${detail.project?.studentName ?? 'The student'} is working on your task. You’ll be notified when the work is submitted.`,
        tone: 'wait',
      };
    case 2:
      return {
        title: 'Under admin review',
        body: 'The work has been submitted and is being reviewed by our admin team before it reaches you.',
        tone: 'wait',
      };
    case 3:
      return {
        title: 'Ready for your review',
        body: 'The submitted work passed admin review. Review it and approve to release payment.',
        tone: 'action',
      };
    default:
      return {
        title: 'Task completed',
        body: `Payment of ${money(detail.project?.amount ?? 0)} was released to ${detail.project?.studentName ?? 'the student'}.`,
        tone: 'done',
      };
  }
}

export default function ClientTaskDetailScreen({ detail, onBack, onReview, onTab }: Props) {
  const step = currentStep(detail);
  const msg = statusMessage(detail);
  const project = detail.project;

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <BackButton onClick={onBack} />

        <div className={styles.head}>
          <p className={styles.title}>{detail.title}</p>
          <p className={styles.meta}>{money(detail.budget)}</p>
        </div>

        {/* Status banner */}
        <div className={`${styles.banner} ${styles[`banner_${msg.tone}`]}`}>
          <p className={styles.bannerTitle}>{msg.title}</p>
          <p className={styles.bannerBody}>{msg.body}</p>
        </div>

        {/* Lifecycle stepper */}
        <div className={styles.card}>
          <p className={styles.cardTitle}>Progress</p>
          <div className={styles.stepper}>
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div key={label} className={styles.step}>
                  <div className={styles.stepRail}>
                    <span
                      className={`${styles.dot} ${done ? styles.dotDone : active ? styles.dotActive : ''}`}
                    >
                      {done ? <CheckCircleIcon size={16} color="#ffffff" /> : null}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className={`${styles.line} ${i < step ? styles.lineDone : ''}`} />
                    )}
                  </div>
                  <span className={`${styles.stepLabel} ${done || active ? styles.stepLabelOn : ''}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned student */}
        {project && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Assigned student</p>
            <div className={styles.studentRow}>
              <div className={styles.avatar}>
                <UserIcon size={22} color="#111827" />
              </div>
              <div>
                <p className={styles.studentName}>{project.studentName}</p>
                <p className={styles.studentSub}>Verified student · {money(project.amount)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submitted work */}
        {detail.submission && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Submitted work</p>
            <p className={styles.submittedOn}>Submitted {detail.submission.submittedAt}</p>
            {detail.submission.note && <p className={styles.note}>“{detail.submission.note}”</p>}

            <div className={styles.previewGrid}>
              {detail.submission.files
                .filter((f) => f.isImage)
                .map((f) => (
                  <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className={styles.previewTile}>
                    <img src={f.url} alt={f.name} className={styles.previewImg} />
                  </a>
                ))}
            </div>

            {detail.submission.files.map((f) => (
              <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className={styles.fileRow}>
                <span className={styles.fileIcon}>
                  <FileIcon size={18} color="var(--primary-blue)" />
                </span>
                <span className={styles.fileName}>{f.name}</span>
                <DownloadIcon size={16} color="var(--primary-blue)" />
              </a>
            ))}
          </div>
        )}

        {msg.tone === 'action' && (
          <div className={styles.action}>
            <PrimaryButton label="Review & Approve Work" showIcon={false} fullWidth onClick={onReview} />
          </div>
        )}
        {msg.tone === 'done' && (
          <div className={styles.doneRow}>
            <CheckCircleIcon size={18} color="#107535" />
            <span>Payment released · task closed</span>
          </div>
        )}
      </div>

      <BottomNav active="tasks" onSelect={onTab} variant="client" />
    </div>
  );
}
