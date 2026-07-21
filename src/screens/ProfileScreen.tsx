import {
  ActivityIcon,
  ArrowRightCircleIcon,
  BottomNav,
  ChevronRightIcon,
  DollarSignIcon,
  EyeIcon,
  StarIcon,
  type MainTab,
} from '../components/ui';
import type { StudentProfile } from '../types/profile';
import styles from './ProfileScreen.module.css';

const violet = '#6014E0';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  profile: StudentProfile | null;
  verified: boolean;
  onEditProfile: () => void;
  onLogout: () => void;
  onTab: (tab: MainTab) => void;
};

function shortAddress(address?: string) {
  if (!address) return 'Not yet created';
  return address.length > 14
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

export default function ProfileScreen({
  name,
  email,
  walletAddress,
  profile,
  verified,
  onEditProfile,
  onLogout,
  onTab,
}: Props) {
  const displayName = name || email.split('@')[0] || 'Student';
  const initial = displayName.charAt(0).toUpperCase();
  const role = profile?.skills[0] ?? 'Student';

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>
            {profile?.avatarUri ? (
              <img src={profile.avatarUri} className={styles.avatarImg} alt="" />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
          </div>
          <p className={styles.name}>{displayName}</p>
          <p className={styles.role}>{role}</p>
          <div className={styles.ratingRow}>
            <StarIcon size={15} />
            <span className={styles.ratingText}>0.0 (0 reviews)</span>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Projects</span>
              <span className={styles.heroStatValue}>0</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Clients</span>
              <span className={styles.heroStatValue}>0</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Ratings</span>
              <span className={styles.heroStatValueRow}>
                <StarIcon size={13} />
                <span className={styles.heroStatValue}>0.0</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          {/* Stats tiles */}
          <div className={styles.statsRow}>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Active Bids</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statIcon} style={{ background: '#EDE4FC' }}>
                  <ActivityIcon size={12} color={violet} />
                </span>
              </div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Earnings</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>$0.00</span>
                <span className={styles.statIcon} style={{ background: '#DCFCE7' }}>
                  <DollarSignIcon size={12} color="#16A34A" />
                </span>
              </div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Profile Views</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statIcon} style={{ background: '#FEF3C7' }}>
                  <EyeIcon size={12} color="#D97706" />
                </span>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div className={styles.walletCard}>
            <span className={styles.walletLabel}>Wallet address</span>
            <p className={styles.walletValue}>{shortAddress(walletAddress)}</p>
          </div>

          {/* Verification */}
          <div className={styles.row}>
            <span className={styles.rowLabel}>Verification status</span>
            <span
              className={styles.rowStatus}
              style={{ color: verified ? '#107535' : '#D97706' }}
            >
              {verified ? 'Successful' : 'Pending'}
            </span>
          </div>

          {/* Edit profile */}
          <button className={styles.row} onClick={onEditProfile}>
            <span className={styles.rowLabel}>Edit profile</span>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </button>

          {/* Log out */}
          <button className={styles.logout} onClick={onLogout}>
            <span>Log Out</span>
            <ArrowRightCircleIcon size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>

      <BottomNav active="profile" onSelect={onTab} />
    </div>
  );
}
