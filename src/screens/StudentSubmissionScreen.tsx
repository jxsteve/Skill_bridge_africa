/**
 * Student's view of the work they already submitted. Shown when they open a task
 * that's under admin review (or awaiting client approval) instead of a fresh
 * submit form — with the option to edit/resubmit while it's still under review.
 */
import { ChevronLeftIcon, DownloadIcon, FileIcon, PrimaryButton } from '../components/ui';
import type { SubmissionFile } from '../data/marketplace-service';
import styles from './SubmitWorkScreen.module.css';

type Props = {
  status: string;
  note: string;
  submittedAt: string;
  files: SubmissionFile[];
  editable: boolean;
  onBack: () => void;
  onEdit: () => void;
};

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  under_review: { label: 'Under admin review', bg: '#fef3c7', color: '#b45309' },
  submitted: { label: 'Under admin review', bg: '#fef3c7', color: '#b45309' },
  approved: { label: 'Awaiting client approval', bg: '#ede9fe', color: '#6d28d9' },
  completed: { label: 'Completed', bg: '#dcfce7', color: '#16a34a' },
};

export default function StudentSubmissionScreen({
  status,
  note,
  submittedAt,
  files,
  editable,
  onBack,
  onEdit,
}: Props) {
  const s = STATUS[status] ?? { label: status, bg: '#eef2f7', color: '#6b7280' };
  const images = files.filter((f) => f.isImage);

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <button className={styles.back} onClick={onBack}>
            <ChevronLeftIcon />
          </button>

          <p className={styles.heading}>Your Submission</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 999,
                padding: '5px 12px',
                background: s.bg,
                color: s.color,
              }}
            >
              {s.label}
            </span>
            {submittedAt && (
              <span style={{ fontSize: 13, color: '#6b7280' }}>Submitted {submittedAt}</span>
            )}
          </div>

          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
              {images.map((f) => (
                <a
                  key={f.url}
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: 96, height: 96, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb', display: 'block' }}
                >
                  <img src={f.url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </a>
              ))}
            </div>
          )}

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {files.map((f) => (
              <a
                key={f.url}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: 'var(--blue-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileIcon size={18} color="var(--primary-blue)" />
                </span>
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {f.name}
                </span>
                <DownloadIcon size={16} color="var(--primary-blue)" />
              </a>
            ))}
            {files.length === 0 && (
              <p style={{ fontSize: 14, color: '#6b7280' }}>No files were attached to this submission.</p>
            )}
          </div>

          {note && (
            <div style={{ marginTop: 18 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>Your note</p>
              <p style={{ margin: '6px 0 0', fontSize: 15, color: '#374151', fontStyle: 'italic', lineHeight: 1.5 }}>
                “{note}”
              </p>
            </div>
          )}
        </div>
      </div>

      {editable && (
        <div className={styles.footer}>
          <PrimaryButton label="Edit submission" showIcon={false} fullWidth onClick={onEdit} />
        </div>
      )}
    </div>
  );
}
