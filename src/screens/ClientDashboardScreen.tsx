import { useState } from 'react';

import {
  BellIcon,
  BottomNav,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  LockIcon,
  MainTab,
  PrimaryButton,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import styles from './ClientDashboardScreen.module.css';

export type ClientAccountStatus = 'unverified' | 'pending' | 'verified';

type Props = {
  clientName: string;
  accountStatus: ClientAccountStatus;
  walletBalance: number;
  walletAddress?: string;
  totalFunded?: number;
  onHold?: number;
  totalSpent?: number;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onFundWallet: () => void;
  onAddFunds?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onCreateTask: () => void;
  onMyTasks: () => void;
  onWallet: () => void;
  onProjects: () => void;
};

const STATUS_COPY: Record<ClientAccountStatus, { label: string; description: string }> = {
  unverified: {
    label: 'Unverified',
    description:
      'Complete your profile and fund your wallet to post task and connect with students',
  },
  pending: {
    label: 'Pending',
    description: 'Your verification is in progress. This usually takes a few minutes.',
  },
  verified: {
    label: 'Verified',
    description: 'Your account is fully verified. You can post tasks and hire students.',
  },
};

function shortAddress(address?: string) {
  if (!address) return '';
  return address.length > 10 ? `${address.slice(0, 5)}....${address.slice(-5)}` : address;
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

export default function ClientDashboardScreen({
  clientName,
  accountStatus,
  walletBalance,
  walletAddress = '',
  totalFunded = 0,
  onHold = 0,
  totalSpent = 0,
  avatarUrl,
  hasUnreadNotifications = false,
  activeTab,
  onSelectTab,
  onFundWallet,
  onAddFunds,
  onNotificationsClick,
  onProfileClick,
  onCreateTask,
  onMyTasks,
  onWallet,
  onProjects,
}: Props) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const isVerified = accountStatus === 'verified';
  const hasFunds = walletBalance > 0;
  const quickActionsEnabled = isVerified && hasFunds;
  const status = STATUS_COPY[accountStatus];

  const header = (
    <>
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
        <button className={styles.bell} onClick={onNotificationsClick} aria-label="Notifications">
          <BellIcon size={22} />
          {hasUnreadNotifications && <span className={styles.bellDot} />}
        </button>
      </div>

      <div className={styles.welcomeRow}>
        <div>
          <p className={styles.welcomeText}>Welcome{isVerified ? ',' : ' back,'}</p>
          <p className={styles.welcomeName}>{clientName}</p>
          <p className={styles.roleTag}>Client</p>
        </div>
        <button className={styles.avatarButton} onClick={onProfileClick} aria-label="Profile">
          {avatarUrl ? (
            <img className={styles.avatarImage} src={avatarUrl} alt="" />
          ) : (
            <UserIcon size={26} color="#111827" />
          )}
          {isVerified && <span className={styles.onlineDot} />}
        </button>
      </div>
    </>
  );

  if (isVerified) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {header}

          <section className={styles.balanceCard}>
            <div className={styles.balanceHeaderRow}>
              <span className={styles.balanceLabel}>Wallet Balance</span>
              <button
                className={styles.eyeButton}
                onClick={() => setBalanceHidden((h) => !h)}
                aria-label={balanceHidden ? 'Show balance' : 'Hide balance'}
              >
                {balanceHidden ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            <p className={styles.balanceValueLarge}>
              {balanceHidden ? '••••••' : formatCurrency(walletBalance)}
            </p>

            <div className={styles.balanceDivider} />

            <div className={styles.balanceAddressRow}>
              <div>
                <p className={styles.balanceAddressLabel}>Wallet Address (Solana)</p>
                <p className={styles.balanceAddressValue}>{shortAddress(walletAddress)}</p>
              </div>
              <button className={styles.copyIconButton} aria-label="Copy wallet address">
                <CopyIcon size={16} color="var(--title-dark)" />
              </button>
            </div>

            <button className={styles.addFundsButton} onClick={onAddFunds ?? onFundWallet}>
              Add Funds
            </button>
          </section>

          <section className={styles.addressCard}>
            <p className={styles.addressLabel}>Platform Wallet Address</p>
            <div className={styles.addressPill}>
              <span className={styles.addressPillValue}>{shortAddress(walletAddress)}</span>
              <button className={styles.copyIconButton} aria-label="Copy platform address">
                <CopyIcon size={16} color="var(--violet)" />
              </button>
            </div>
            <p className={styles.networkLabel}>Network</p>
            <p className={styles.networkValue}>Solana (SOL)</p>
          </section>

          <section className={styles.statsCard}>
            <div className={styles.statsRow}>
              <span>Total funded</span>
              <span className={styles.statsValue}>{formatCurrency(totalFunded)}</span>
            </div>
            <div className={styles.statsRow}>
              <span>On Hold</span>
              <span className={styles.statsValue}>{formatCurrency(onHold)}</span>
            </div>
            <div className={`${styles.statsRow} ${styles.statsRowLast}`}>
              <span>Total Spent</span>
              <span className={styles.statsValue}>{formatCurrency(totalSpent)}</span>
            </div>
          </section>

          <div className={styles.createTaskButton}>
            <PrimaryButton label="Create a Task" showIcon={false} fullWidth onClick={onCreateTask} />
          </div>

          <div className={styles.securityNote}>
            <LockIcon size={40} color="var(--primary-blue)" />
            <p>
              Your funds are held securely on the blockchain and released only after work is
              approved.
            </p>
          </div>
        </div>

        <BottomNav active={activeTab} onSelect={onSelectTab} variant="client" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {header}

        <section className={styles.card}>
          <p className={styles.cardLabel}>Account Status</p>
          <p className={`${styles.statusValue} ${styles.statusUnverified}`}>{status.label}</p>
          <p className={styles.cardDescription}>{status.description}</p>
        </section>

        <section className={styles.card}>
          <p className={styles.cardLabel}>Wallet Balance</p>
          <p className={styles.balanceValue}>{formatCurrency(walletBalance)}</p>
          <p className={styles.cardDescription}>
            fund your wallet to post tasks and hire verified students
          </p>
          <div className={styles.fundButton}>
            <PrimaryButton
              label="Fund Platform wallet"
              showIcon={false}
              fullWidth
              onClick={onFundWallet}
            />
          </div>
        </section>

        <section className={styles.quickActions}>
          <p className={styles.quickActionsTitle}>Quick Actions</p>
          <div className={styles.quickActionsGrid}>
            <button
              className={styles.quickAction}
              disabled={!quickActionsEnabled}
              onClick={onCreateTask}
            >
              <SearchIcon size={20} color={quickActionsEnabled ? '#111827' : '#C4C9D4'} />
              <span>Create Task</span>
            </button>
            <button
              className={styles.quickAction}
              disabled={!quickActionsEnabled}
              onClick={onMyTasks}
            >
              <UsersIcon size={20} color={quickActionsEnabled ? '#111827' : '#C4C9D4'} />
              <span>My Tasks</span>
            </button>
            <button className={styles.quickAction} disabled={!quickActionsEnabled} onClick={onWallet}>
              <WalletIcon size={20} color={quickActionsEnabled ? '#6014E0' : '#C4C9D4'} />
              <span>wallet</span>
            </button>
            <button
              className={styles.quickAction}
              disabled={!quickActionsEnabled}
              onClick={onProjects}
            >
              <FileIcon size={20} color={quickActionsEnabled ? '#111827' : '#C4C9D4'} />
              <span>Projects</span>
            </button>
          </div>
        </section>

        <div className={styles.securityNote}>
          <ShieldCheckIcon size={20} color="#124CC9" />
          <p>
            Your funds are safe and secured we use blockchain technology to ensure transparency
            and security
          </p>
        </div>
      </div>

      <BottomNav active={activeTab} onSelect={onSelectTab} variant="client" />
    </div>
  );
}