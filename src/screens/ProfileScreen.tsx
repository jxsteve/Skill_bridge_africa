import { BottomNav, ChevronRightIcon, type MainTab } from '../components/ui';
import styles from './ProfileScreen.module.css';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  avatarUri?: string;
  onEditProfile: () => void;
  onTab: (tab: MainTab) => void;
};

function shortAddress(address?: string) {
  if (!address) return 'Not yet created';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

export default function ProfileScreen({
  name,
  email,
  walletAddress,
  avatarUri,
  onEditProfile,
  onTab,
}: Props) {
  const displayName = name || email.split('@')[0] || 'Student';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {avatarUri ? (
              <img src={avatarUri} className={styles.avatarImg} alt="" />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
          </div>
          <p className={styles.name}>{displayName}</p>
          <p className={styles.email}>{email}</p>
        </div>

        <div className={styles.walletCard}>
          <span className={styles.walletLabel}>Wallet address</span>
          <p className={styles.walletValue}>{shortAddress(walletAddress)}</p>
        </div>

        <button className={styles.row} onClick={onEditProfile}>
          <span className={styles.rowLabel}>Edit profile</span>
          <ChevronRightIcon size={18} color="#9CA3AF" />
        </button>
        <button className={styles.row}>
          <span className={styles.rowLabel}>Verification status</span>
          <span className={styles.rowValue}>Pending</span>
        </button>
        <button className={styles.row}>
          <span className={styles.rowLabel}>Help &amp; support</span>
          <ChevronRightIcon size={18} color="#9CA3AF" />
        </button>
      </div>

      <BottomNav active="profile" onSelect={onTab} />
    </div>
  );
}
