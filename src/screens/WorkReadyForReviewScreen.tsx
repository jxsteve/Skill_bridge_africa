import { CelebrationCheck, DownloadIcon, FileIcon, PrimaryButton, UserIcon } from '../components/ui';
import styles from './WorkReadyForReviewScreen.module.css';

export type SubmittedFile = {
  name: string;
  sizeLabel: string;
};

type Props = {
  studentName: string;
  submittedDate: string;
  studentAvatarUrl?: string;
  files: SubmittedFile[];
  onDownloadFile?: (file: SubmittedFile) => void;
  onReviewWork: () => void;
};

export default function WorkReadyForReviewScreen({
  studentName,
  submittedDate,
  studentAvatarUrl,
  files,
  onDownloadFile,
  onReviewWork,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CelebrationCheck />

        <p className={styles.title}>Work Ready for Your Review</p>
        <p className={styles.subtitle}>
          The work has been approved by our admin and is ready for your review.
        </p>

        <section className={styles.card}>
          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>Submitted by</p>
            <div className={styles.studentRow}>
              <div className={styles.avatar}>
                {studentAvatarUrl ? (
                  <img className={styles.avatarImage} src={studentAvatarUrl} alt="" />
                ) : (
                  <UserIcon size={22} color="#111827" />
                )}
              </div>
              <div>
                <p className={styles.studentName}>{studentName}</p>
                <p className={styles.submittedDate}>{submittedDate}</p>
              </div>
            </div>
          </div>

          <div className={`${styles.sectionRow} ${styles.sectionRowLast}`}>
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
        </section>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton label="Review Work" showIcon={false} fullWidth onClick={onReviewWork} />
        </div>
      </div>
    </div>
  );
}