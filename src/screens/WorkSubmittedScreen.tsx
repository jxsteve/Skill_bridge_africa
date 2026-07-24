import { CelebrationCheck, DownloadIcon, FileIcon } from '../components/ui';
import styles from './WorkSubmittedScreen.module.css';

export type SubmittedFile = {
  name: string;
  sizeLabel: string;
};

type Props = {
  studentName: string;
  submittedOn: string;
  files: SubmittedFile[];
  onDownloadFile?: (file: SubmittedFile) => void;
};

export default function WorkSubmittedScreen({
  studentName,
  submittedOn,
  files,
  onDownloadFile,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CelebrationCheck />

        <p className={styles.title}>Work Submitted</p>
        <p className={styles.subtitle}>
          {studentName} has submitted the completed work for your review
        </p>

        <section className={styles.card}>
          <div className={styles.sectionRow}>
            <p className={styles.sectionLabel}>Submitted on</p>
            <p className={styles.sectionValue}>{submittedOn}</p>
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
      </div>
    </div>
  );
}