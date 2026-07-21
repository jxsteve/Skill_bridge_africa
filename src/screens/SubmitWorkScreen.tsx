import { useRef, useState } from 'react';

import { ChevronLeftIcon, PrimaryButton, UploadCloudIcon } from '../components/ui';
import styles from './SubmitWorkScreen.module.css';

const MAX_MESSAGE = 200;

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

export default function SubmitWorkScreen({ onBack, onSubmit }: Props) {
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <button className={styles.back} onClick={onBack}>
            <ChevronLeftIcon />
          </button>

          <p className={styles.heading}>Submit Your Work</p>

          <p className={styles.label}>Upload Files</p>
          <button className={styles.upload} onClick={() => fileRef.current?.click()}>
            <span className={styles.uploadIcon}>
              <UploadCloudIcon size={28} />
            </span>
            <span className={styles.uploadText}>Upload File</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            className={styles.hiddenInput}
          />
          <p className={styles.hint}>PNG, JPG or PDF (Max. 10MB)</p>

          <p className={styles.label}>Message (Optional)</p>
          <div className={styles.textareaField}>
            <textarea
              className={styles.textarea}
              placeholder="Add a short note about your work"
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <span className={styles.counter}>
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>

          <p className={styles.label}>Project preview (Optional)</p>
          <div className={styles.previewRow}>
            <div className={styles.previewTile}>
              <span className={styles.previewMore}>+4</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <PrimaryButton label="Submit Work" showIcon={false} fullWidth onClick={onSubmit} />
      </div>
    </div>
  );
}
