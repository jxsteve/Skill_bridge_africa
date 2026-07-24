import { ClockIcon, DownloadIcon, FileIcon, FileSearchIcon, UserIcon } from '../components/ui';
import styles from './SubmissionUnderReviewScreen.module.css';

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
};

export default function SubmissionUnderReviewScreen({
  studentName,
  submittedDate,
  studentAvatarUrl,
  files,
  onDownloadFile,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconCircle}>
          <FileSearchIcon size={44} color="var(--primary-blue)" />
        </div>

        <p className={styles.title}>Submission Under Review</p>
        <p className={styles.subtitle}>
          Our Admin is reviewing the submitted work to ensure quality and alignment with your
          requirements.
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

        <div className={styles.infoBanner}>
          <ClockIcon size={16} />
          <span>you will be notified once the work is forwarded to you.</span>
        </div>
      </div>
    </div>
  );
}