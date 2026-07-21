import { useState, type ReactNode } from 'react';

import {
  BellIcon,
  BottomNav,
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  type MainTab,
} from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import styles from './StudentDashboardScreen.module.css';

const violet = '#6014E0';
const green = '#16A34A';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  onImproveProfile: () => void;
  onBrowseTasks: () => void;
  onOpenBids: () => void;
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
  onOpenBids,
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
          <Stat label="Active Bids" value="0" chip="#F9F6FE">
            <SearchIcon size={12} color={violet} />
          </Stat>
          <Stat label="Completed" value="0" chip="#DCFCE7">
            <CheckCircleIcon size={12} color={green} />
          </Stat>
          <Stat label="Earnings" value="$0.00" chip="#F9F6FE">
            <BriefcaseBusinessIcon size={12} color={violet} />
          </Stat>
          <Stat label="Profile Views" value="0" chip="#FEF3C7">
            <EyeIcon size={12} color="#D97706" />
          </Stat>
        </div>

        {/* My Active Tasks — empty */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>My Active Tasks</span>
            <span className={styles.viewAll}>View all</span>
          </div>
          <div className={styles.emptyBlock}>
            <div className={styles.emptyIcon}>
              <ClipboardListIcon size={26} color={violet} />
            </div>
            <p className={styles.emptyText}>
              No active tasks yet. Browse tasks and place a bid to get started.
            </p>
          </div>
        </div>

        {/* Recent Activity — empty */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Recent Activity</span>
            <span className={styles.viewAll}>View all</span>
          </div>
          <div className={styles.emptyBlock}>
            <div className={styles.emptyIcon}>
              <BellIcon size={24} color={violet} />
            </div>
            <p className={styles.emptyText}>
              No activity yet. Payments and updates will show up here.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Quick Actions</span>
          <div className={styles.quickRow}>
            <QuickAction label="Browse Tasks" onClick={onBrowseTasks}>
              <SearchIcon size={18} color={violet} />
            </QuickAction>
            <QuickAction label="My Bids" onClick={onOpenBids}>
              <UsersIcon size={18} color={violet} />
            </QuickAction>
            <QuickAction label="Profile" onClick={() => onTab('profile')}>
              <UserIcon size={18} color={violet} />
            </QuickAction>
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

function QuickAction({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className={styles.quickTile} onClick={onClick}>
      {children}
      <span className={styles.quickLabel}>{label}</span>
    </button>
  );
}
