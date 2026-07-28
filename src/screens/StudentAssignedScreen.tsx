import { CelebrationCheck, Chip, PrimaryButton, StarIcon, UserIcon } from '../components/ui';
import styles from './StudentAssignedScreen.module.css';

export type AssignedStudent = {
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  school: string;
  skills: string[];
  avatarUrl?: string;
};

type Props = {
  student: AssignedStudent;
  onViewTaskDetails: () => void;
};

export default function StudentAssignedScreen({ student, onViewTaskDetails }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CelebrationCheck />

        <p className={styles.title}>Student Assigned!</p>
        <p className={styles.subtitle}>Our Admin team has assigned a verified student to your task.</p>

        <section className={styles.studentCard}>
          <div className={styles.studentHeaderRow}>
            <div className={styles.avatar}>
              {student.avatarUrl ? (
                <img className={styles.avatarImage} src={student.avatarUrl} alt="" />
              ) : (
                <UserIcon size={28} color="#111827" />
              )}
            </div>
            <div>
              <p className={styles.studentName}>{student.name}</p>
              <p className={styles.studentRole}>{student.role}</p>
              <div className={styles.ratingRow}>
                <StarIcon size={14} />
                <span>
                  {student.rating.toFixed(1)} ({student.reviewCount} reviews)
                </span>
              </div>
              <p className={styles.studentSchool}>{student.school}</p>
            </div>
          </div>

          <p className={styles.skillsLabel}>Skills</p>
          <div className={styles.skillsRow}>
            {student.skills.map((skill) => (
              <Chip key={skill} label={skill} selected />
            ))}
          </div>
        </section>

        <div className={styles.spacer} />

        <div className={styles.submit}>
          <PrimaryButton
            label="View Task Details"
            showIcon={false}
            fullWidth
            onClick={onViewTaskDetails}
          />
        </div>
      </div>
    </div>
  );
}