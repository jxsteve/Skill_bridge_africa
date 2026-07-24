import { useState } from 'react';

import { PrimaryButton, StarIcon, UserIcon } from '../components/ui';
import styles from './RateExperienceScreen.module.css';

const MAX_REVIEW_LENGTH = 200;

type Props = {
  studentName: string;
  studentAvatarUrl?: string;
  onSubmit: (rating: number, review: string) => void;
  onSkip: () => void;
};

export default function RateExperienceScreen({
  studentName,
  studentAvatarUrl,
  onSubmit,
  onSkip,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const displayRating = hoverRating || rating;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          {studentAvatarUrl ? (
            <img className={styles.avatarImage} src={studentAvatarUrl} alt="" />
          ) : (
            <UserIcon size={40} color="#111827" />
          )}
        </div>

        <p className={styles.title}>Rate Your Experience</p>
        <p className={styles.subtitle}>
          How would you rate your experience working with {studentName}?
        </p>

        <div className={styles.starsRow} onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className={styles.starButton}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
            >
              <StarIcon size={30} color={value <= displayRating ? '#F0A32E' : '#D1D5DB'} />
            </button>
          ))}
        </div>

        <div className={styles.reviewSection}>
          <p className={styles.reviewLabel}>
            Leave a review <span className={styles.optional}>(Optional)</span>
          </p>
          <textarea
            className={styles.reviewInput}
            rows={4}
            maxLength={MAX_REVIEW_LENGTH}
            placeholder="Share details about your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <span className={styles.charCount}>
            {review.length}/{MAX_REVIEW_LENGTH}
          </span>
        </div>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton
            label="Submit Review"
            showIcon={false}
            fullWidth
            disabled={rating === 0}
            onClick={() => onSubmit(rating, review)}
          />
        </div>
        <button className={styles.skipButton} onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}