import {
  ActivityIcon,
  BellIcon,
  ChevronRightIcon,
  IdCardIcon,
  MessageSquareIcon,
} from '../components/ui';
import type { StudentProfile } from '../types/profile';
import logoMark from '../assets/images/logo_mark.png';
import styles from './StudentHomeScreen.module.css';

const violet = '#6014E0';

type Props = {
  name: string;
  email: string;
  profile: StudentProfile | null;
  onCompleteProfile: () => void;
};

/** Signup alone earns the base completion shown in the design. */
export function profileCompletion(profile: StudentProfile | null): number {
  let percent = 40;
  if (!profile) return percent;
  if (profile.university && profile.course && profile.level) percent += 20;
  if (profile.skills.length > 0) percent += 15;
  if (profile.bio) percent += 15;
  if (profile.portfolio.length > 0) percent += 10;
  return Math.min(percent, 100);
}

/**
 * Pre-completion home: the full app (wallet, tasks, tabs) unlocks only after
 * the profile is completed and verified, so this screen stays focused on the
 * completion call-to-action and starter tips.
 */
export default function StudentHomeScreen({
  name,
  email,
  profile,
  onCompleteProfile,
}: Props) {
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();
  const completion = profileCompletion(profile);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header: brand + notifications */}
        <div className={styles.headerRow}>
          <div className={styles.brandRow}>
            <img src={logoMark} className={styles.brandMark} alt="" />
            <div>
              <p className={styles.brandWordmark}>
                <span style={{ color: 'var(--primary-blue)' }}>Skill</span>
                <span style={{ color: 'var(--brand-green)' }}>Bridge</span>
              </p>
              <p className={styles.brandAfrica}>–AFRICA–</p>
            </div>
          </div>
          <button className={styles.bell}>
            <BellIcon />
          </button>
        </div>

        {/* Welcome */}
        <div className={styles.welcomeRow}>
          <div className={styles.welcomeText}>
            <span className={styles.welcomeLabel}>Welcome,</span>
            <p className={styles.welcomeName}>{displayName}</p>
          </div>
          <div className={styles.avatar}>
            <span className={styles.avatarInitial}>{initial}</span>
          </div>
        </div>

        {/* Complete your profile */}
        {completion < 100 && (
          <div className={`${styles.card} ${styles.softCard}`}>
            <span className={styles.cardTitle}>Complete Your Profile</span>
            <p className={styles.cardBody}>
              {'Finish setting up your profile to\nunlock personalised opportunities'}
            </p>
            <div className={styles.progressRow}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className={styles.progressLabel}>{completion}%</span>
            </div>
            <button className={styles.primaryButton} onClick={onCompleteProfile}>
              Complete Profile
            </button>
          </div>
        )}

        {/* Tips */}
        <div className={`${styles.card} ${styles.outlineCard}`}>
          <span className={styles.cardTitleSmall}>Tips to Get Started</span>
          <div className={styles.tipsList}>
            <button className={styles.tipRow} onClick={onCompleteProfile}>
              <div className={styles.tipIcon}>
                <ActivityIcon size={16} />
              </div>
              <div className={styles.tipText}>
                <span className={styles.tipTitle}>Complete your Profile</span>
                <span className={styles.tipBody}>
                  Add your skills, bio and portfolio
                </span>
              </div>
              <ChevronRightIcon size={18} color={violet} />
            </button>
            <button className={styles.tipRow}>
              <div className={styles.tipIcon}>
                <IdCardIcon size={16} />
              </div>
              <div className={styles.tipText}>
                <span className={styles.tipTitle}>Verify your school ID</span>
                <span className={styles.tipBody}>
                  Increase trust and get more jobs
                </span>
              </div>
              <ChevronRightIcon size={18} color={violet} />
            </button>
            <button className={styles.tipRow}>
              <div className={styles.tipIcon}>
                <MessageSquareIcon size={16} />
              </div>
              <div className={styles.tipText}>
                <span className={styles.tipTitle}>Browse tasks and place a bid</span>
                <span className={styles.tipBody}>
                  Find opportunities that match your skills
                </span>
              </div>
              <ChevronRightIcon size={18} color={violet} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
