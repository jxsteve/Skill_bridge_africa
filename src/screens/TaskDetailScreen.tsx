import { useState } from 'react';

import {
  BookmarkIcon,
  ChevronLeftIcon,
  DownloadIcon,
  FileIcon,
  PrimaryButton,
} from '../components/ui';
import type { Task } from '../data/marketplace';
import styles from './TaskDetailScreen.module.css';

type Props = {
  task: Task;
  studentSkills?: string[];
  requesting?: boolean;
  alreadyApplied?: boolean;
  onBack: () => void;
  onBid: () => void;
  onRequest: () => void;
};

export default function TaskDetailScreen({
  task,
  studentSkills,
  requesting,
  alreadyApplied,
  onBack,
  onBid,
  onRequest,
}: Props) {
  const [saved, setSaved] = useState(false);

  const matched = studentSkills
    ? task.skills.filter((s) =>
        studentSkills.some((mine) => mine.toLowerCase() === s.toLowerCase()),
      )
    : [];
  const hasSkills = studentSkills ? matched.length > 0 : true;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => setSaved((s) => !s)}
          >
            <BookmarkIcon size={18} filled={saved} />
          </button>
        </div>

        <p className={styles.title}>{task.title}</p>
        <p className={styles.postedBy}>
          Posted by <span className={styles.client}>{task.client}</span>
        </p>

        <p className={styles.sectionTitle}>Description</p>
        <p className={styles.description}>{task.description}</p>

        <p className={styles.metaLabel}>Budget</p>
        <p className={styles.metaValue}>${task.budget.toFixed(2)}</p>

        <p className={styles.metaLabel}>Due date</p>
        <p className={styles.metaValueLarge}>{task.dueDate}</p>

        <p className={styles.sectionTitle}>Skills Required</p>
        <div className={styles.skillsRow}>
          {task.skills.map((skill) => (
            <span key={skill} className={styles.skillChip}>
              <span className={styles.skillText}>{skill}</span>
            </span>
          ))}
        </div>
        {studentSkills && (
          <p
            className={styles.metaLabel}
            style={{ color: hasSkills ? '#16A34A' : '#D97706', marginTop: 8 }}
          >
            {hasSkills
              ? `You match ${matched.length} of ${task.skills.length} required skills.`
              : 'This task needs skills not on your profile — you can still request it.'}
          </p>
        )}

        <p className={styles.sectionTitle}>Attachments ({task.attachments.length})</p>
        {task.attachments.map((file) => (
          <div key={file.name} className={styles.fileRow}>
            <div
              className={styles.fileIcon}
              style={{ background: file.kind === 'pdf' ? '#FDECEC' : '#FEF3C7' }}
            >
              <FileIcon size={20} color={file.kind === 'pdf' ? '#DC2626' : '#D97706'} />
            </div>
            <div className={styles.fileText}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{file.size}</span>
            </div>
            <DownloadIcon />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        {alreadyApplied ? (
          <div className={styles.footerButton}>
            <PrimaryButton label="Already applied" showIcon={false} fullWidth disabled onClick={() => {}} />
          </div>
        ) : (
          <div className={styles.footerButton} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PrimaryButton
              label="Place a Bid"
              showIcon={false}
              fullWidth
              disabled={requesting}
              onClick={onBid}
            />
            <button type="button" className={styles.requestLink} onClick={onRequest} disabled={requesting}>
              {requesting ? 'Sending…' : `Request at listed budget ($${task.budget.toFixed(2)})`}
            </button>
          </div>
        )}
        <button type="button" className={styles.footerSave}>
          <BookmarkIcon size={20} />
        </button>
      </div>
    </div>
  );
}
