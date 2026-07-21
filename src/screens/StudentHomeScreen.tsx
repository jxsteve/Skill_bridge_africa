import {
  ActivityIcon,
  BellIcon,
  BottomNav,
  ChevronRightIcon,
  ClipboardListIcon,
  DollarSignIcon,
  EyeIcon,
  IdCardIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  type MainTab,
} from '../components/ui';
import type { StudentProfile } from '../types/profile';
import logoMark from '../assets/images/logo_mark.png';
import styles from './StudentHomeScreen.module.css';

const violet = '#6014E0';
const amber = '#D97706';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  profile: StudentProfile | null;
  onCompleteProfile: () => void;
  onTab: (tab: MainTab) => void;
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

function shortAddress(address: string) {
  return address.length > 14
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address;
}

export default function StudentHomeScreen({
  name,
  email,
  walletAddress,
  profile,
  onCompleteProfile,
  onTab,
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

        {/* Wallet */}
        <div className={`${styles.card} ${styles.softCard}`}>
          <div className={styles.walletHeader}>
            <span className={styles.walletLabel}>Wallet Balance</span>
            <ChevronRightIcon size={18} color="#111827" />
          </div>
          <div className={styles.walletBalanceRow}>
            <span className={styles.walletBalance}>$0.00</span>
            <div className={styles.walletIconCircle}>
              <WalletIcon />
            </div>
          </div>
          <p className={styles.walletHint}>
            {walletAddress
              ? `Your wallet is ready — ${shortAddress(walletAddress)}`
              : 'Complete your profile to create\nyour wallet and receive payments'}
          </p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statTile}>
            <span className={styles.statLabel}>Active Bids</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>0</span>
              <div className={styles.statIcon} style={{ backgroundColor: '#EDE4FC' }}>
                <ActivityIcon size={12} />
              </div>
            </div>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statLabel}>Earnings</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>$0.00</span>
              <div className={styles.statIcon} style={{ backgroundColor: '#DCFCE7' }}>
                <DollarSignIcon size={12} />
              </div>
            </div>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statLabel}>Profile Views</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>0</span>
              <div className={styles.statIcon} style={{ backgroundColor: '#FEF3C7' }}>
                <EyeIcon size={12} color={amber} />
              </div>
            </div>
          </div>
        </div>

        {/* No active tasks */}
        <div className={`${styles.card} ${styles.outlineCard}`}>
          <span className={styles.cardTitleSmall}>No Active Tasks</span>
          <div className={styles.tasksEmpty}>
            <div className={styles.tasksIconWrap}>
              <ClipboardListIcon size={44} />
            </div>
            <p className={styles.tasksEmptyText}>
              {'You don’t have any active tasks yet.\nBrowse tasks and place a bid'}
            </p>
            <button
              className={styles.outlineButton}
              onClick={() => onTab('tasks')}
            >
              Browse Tasks
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className={`${styles.card} ${styles.outlineCard}`}>
          <span className={styles.cardTitleSmall}>Quick Actions</span>
          <div className={styles.quickRow}>
            <button className={styles.quickTile} onClick={() => onTab('tasks')}>
              <SearchIcon size={18} />
              <span className={styles.quickLabel}>Browse Tasks</span>
            </button>
            <button className={styles.quickTile} onClick={() => onTab('bids')}>
              <UsersIcon size={18} />
              <span className={styles.quickLabel}>My Bids</span>
            </button>
            <button className={styles.quickTile} onClick={() => onTab('profile')}>
              <UserIcon size={18} color="#111827" />
              <span className={styles.quickLabel}>Profile</span>
            </button>
          </div>
        </div>

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

      <BottomNav active="home" onSelect={onTab} />
    </div>
  );
}
