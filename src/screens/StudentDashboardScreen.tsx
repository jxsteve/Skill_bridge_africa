import { useState, type ReactNode } from 'react';

import {
  ActivityIcon,
  BellIcon,
  BottomNav,
  ClipboardListIcon,
  CopyIcon,
  DollarSignIcon,
  EyeIcon,
  EyeOffIcon,
  type MainTab,
} from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import styles from './StudentDashboardScreen.module.css';

const violet = '#6014E0';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  onImproveProfile: () => void;
  onBrowseTasks: () => void;
  onTab: (tab: MainTab) => void;
};

function shortAddress(address?: string) {
  if (!address) return '6x1a7…x9kL2';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

export default function StudentDashboardScreen({
  name,
  email,
  walletAddress,
  onImproveProfile,
  onBrowseTasks,
  onTab,
}: Props) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
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
            <span className={styles.bellDot} />
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
            <span className={styles.onlineDot} />
          </div>
        </div>

        {/* Wallet */}
        <div className={styles.walletCard}>
          <div className={styles.walletHeader}>
            <span className={styles.walletLabel}>Wallet Balance</span>
            <button
              className={styles.iconButton}
              onClick={() => setBalanceHidden((h) => !h)}
            >
              {balanceHidden ? (
                <EyeOffIcon size={20} color="#FFFFFF" />
              ) : (
                <EyeIcon size={20} color="#FFFFFF" />
              )}
            </button>
          </div>
          <p className={styles.walletBalance}>
            {balanceHidden ? '••••••' : '$0.00'}
          </p>
          <div className={styles.walletAddressRow}>
            <div className={styles.walletAddressText}>
              <span className={styles.walletAddressLabel}>
                Wallet Address (Solana)
              </span>
              <p className={styles.walletAddressValue}>
                {shortAddress(walletAddress)}
              </p>
            </div>
            <button className={styles.iconButton}>
              <CopyIcon />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <Stat label="Active Bids" value="0" chip="#EDE4FC">
            <ActivityIcon size={12} color={violet} />
          </Stat>
          <Stat label="Earnings" value="$0.00" chip="#DCFCE7">
            <DollarSignIcon size={12} color="#16A34A" />
          </Stat>
          <Stat label="Profile Views" value="0" chip="#FEF3C7">
            <EyeIcon size={12} color="#D97706" />
          </Stat>
        </div>

        {/* No active tasks */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>No Active Tasks</span>
          <div className={styles.tasksEmpty}>
            <div className={styles.tasksIcon}>
              <ClipboardListIcon size={44} color={violet} />
            </div>
            <p className={styles.tasksEmptyText}>
              {'You don’t have any active tasks yet.\nBrowse tasks and place a bid'}
            </p>
            <button className={styles.outlineButton} onClick={onBrowseTasks}>
              Browse Tasks
            </button>
          </div>
        </div>

        {/* Stand out */}
        <div className={styles.standOut}>
          <p className={styles.standOutTitle}>Stand Out. Get Hired Faster!</p>
          <p className={styles.standOutBody}>
            Complete your profile and add a portfolio to increase your chances
          </p>
          <button className={styles.improveButton} onClick={onImproveProfile}>
            Improve Profile
          </button>
        </div>
      </div>

      <BottomNav active="home" onSelect={onTab} />
    </div>
  );
}

function Stat({
  label,
  value,
  chip,
  children,
}: {
  label: string;
  value: string;
  chip: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.statTile}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statValueRow}>
        <span className={styles.statValue}>{value}</span>
        <div className={styles.statIcon} style={{ backgroundColor: chip }}>
          {children}
        </div>
      </div>
    </div>
  );
}
