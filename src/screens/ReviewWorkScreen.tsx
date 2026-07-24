import { useState } from 'react';

import { ChevronLeftIcon, DownloadIcon, FileIcon, UserIcon } from '../components/ui';
import styles from './ReviewWorkScreen.module.css';

export type SubmittedFile = {
  name: string;
  sizeLabel: string;
};

type Props = {
  taskTitle: string;
  studentName: string;
  studentAvatarUrl?: string;
  files: SubmittedFile[];
  onBack: () => void;
  onDownloadFile?: (file: SubmittedFile) => void;
  onRequestChanges: (feedback: string) => void;
  onApproveWork: (feedback: string) => void;
};

export default function ReviewWorkScreen({
  taskTitle,
  studentName,
  studentAvatarUrl,
  files,
  onBack,
  onDownloadFile,
  onRequestChanges,
  onApproveWork,
}: Props) {
  const [feedback, setFeedback] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={24} />
          </button>
          <p className={styles.title}>Review Work</p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>Title</p>
            <p className={styles.sectionValue}>{taskTitle}</p>
          </div>

          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>From</p>
            <div className={styles.studentRow}>
              <div className={styles.avatar}>
                {studentAvatarUrl ? (
                  <img className={styles.avatarImage} src={studentAvatarUrl} alt="" />
                ) : (
                  <UserIcon size={20} color="#111827" />
                )}
              </div>
              <span className={styles.studentName}>{studentName}</span>
            </div>
          </div>

          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>Files</p>
            {files.map((file) => (
              <div key={file.name} className={styles.fileRow}>
                <span className={styles.fileIcon}>
                  <FileIcon size={20} color="var(--primary-blue)" />
                </span>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{file.sizeLabel}</p>
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={() => onDownloadFile?.(file)}
                  aria-label={`Download ${file.name}`}
                >
                  <DownloadIcon size={18} color="var(--primary-blue)" />
                </button>
              </div>
            ))}
          </div>

          <div className={`${styles.sectionRow} ${styles.sectionRowLast}`}>
            <p className={styles.sectionLabel}>
              Your Feedback <span className={styles.optional}>(Optional)</span>
            </p>
            <textarea
              className={styles.feedbackInput}
              rows={3}
              placeholder="Share any feedback about the submitted work..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.requestChangesButton} onClick={() => onRequestChanges(feedback)}>
            Request Changes
          </button>
          <button className={styles.approveButton} onClick={() => onApproveWork(feedback)}>
            Approve Work
          </button>
        </div>
      </div>
    </div>
  );
}