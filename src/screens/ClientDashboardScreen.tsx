import { useEffect, useState } from 'react';

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
import { isSupabaseConfigured } from '../lib/supabase';
import { getClientAttention, listMyNotifications } from '../data/marketplace-service';
import type { AppNotification } from '../data/notifications';
import styles from './ClientDashboardScreen.module.css';

export type ClientAccountStatus = 'unverified' | 'pending' | 'verified';

type Props = {
  clientId?: string;
  clientName: string;
  accountStatus: ClientAccountStatus;
  hasTaskNotification: boolean;
  walletBalance: number;
  walletAddress?: string;
  totalFunded?: number;
  onHold?: number;
  totalSpent?: number;
  avatarUrl?: string;
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onFundWallet: () => void;
  onAddFunds?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onOpenActivity?: (link: string) => void;
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
  clientId,
  clientName,
  accountStatus,
  hasTaskNotification,
  walletBalance,
  walletAddress = '',
  totalFunded = 0,
  onHold = 0,
  totalSpent = 0,
  avatarUrl,
  activeTab,
  onSelectTab,
  onFundWallet,
  onAddFunds,
  onNotificationsClick,
  onProfileClick,
  onOpenActivity,
  onCreateTask,
  onMyTasks,
  onWallet,
  onProjects,
}: Props) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [activity, setActivity] = useState<AppNotification[]>([]);
  const [awaitingReview, setAwaitingReview] = useState(0);
  const [attentionOpen, setAttentionOpen] = useState(true);
  const isVerified = accountStatus === 'verified';

  useEffect(() => {
    if (!isSupabaseConfigured || !clientId) return;
    listMyNotifications(clientId, true)
      .then((n) => setActivity(n.slice(0, 4)))
      .catch(() => {});
    getClientAttention(clientId)
      .then((a) => setAwaitingReview(a.awaitingReview))
      .catch(() => {});
  }, [clientId]);

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
        <button
          className={styles.bell}
          disabled={!isVerified}
          onClick={() => {
            if (!isVerified) return;
            onNotificationsClick?.();
          }}
          aria-label="Notifications"
        >
          <BellIcon size={22} />
          {hasTaskNotification && <span className={styles.bellDot} />}
        </button>
      </div>

      <div className={styles.welcomeRow}>
        <div>
          <p className={styles.welcomeText}>Welcome{isVerified ? ',' : ' back,'}</p>
          <p className={styles.welcomeName}>{clientName}</p>
          <p className={styles.roleTag}>Client</p>
        </div>
        <button 
          className={styles.avatarButton} 
          disabled={!isVerified}
          onClick={() => {
            if (!isVerified) return;
            onProfileClick?.();
          }}
          aria-label="Profile"
        >
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

          {/* Needs your attention — collapsible, sits below the wallet */}
          {(awaitingReview > 0 || activity.length > 0) && (
            <section
              style={{
                background: '#fff',
                border: '1px solid #eaecef',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <button
                onClick={() => setAttentionOpen((o) => !o)}
                aria-expanded={attentionOpen}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--title-dark)' }}>
                  Needs your attention
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      padding: '0 6px',
                      borderRadius: 999,
                      background: 'var(--primary-blue)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {awaitingReview + activity.length}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: 15 }}>{attentionOpen ? '⌃' : '⌄'}</span>
                </span>
              </button>

              {attentionOpen && (
                <>
                  {awaitingReview > 0 && (
                    <button
                      onClick={onMyTasks}
                      style={{
                        marginTop: 12,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        background: '#ecfdf3',
                        border: '1px solid #c7f0d8',
                        borderRadius: 12,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#107535' }}>
                        {awaitingReview} task{awaitingReview > 1 ? 's' : ''} ready for your review
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#107535' }}>Review →</span>
                    </button>
                  )}

                  {activity.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => onOpenActivity?.(n.link ?? '/client/tasks')}
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        padding: '10px 0',
                        marginTop: 8,
                        border: 'none',
                        borderTop: '1px solid #f0f1f3',
                        background: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary-blue)', marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{n.title}</p>
                        {n.body && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{n.body}</p>}
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#9ca3af' }}>{n.time}</p>
                      </div>
                      <span style={{ color: '#c4c9d4', fontSize: 18, alignSelf: 'center' }}>›</span>
                    </button>
                  ))}
                </>
              )}
            </section>
          )}

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

        <BottomNav 
          active={activeTab} 
          onSelect={(tab) => {
            if (!isVerified) return;
            onSelectTab(tab);
          }} 
          variant="client" 
        />
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

      <BottomNav 
        active={activeTab}
        disabled={!isVerified} 
        onSelect={onSelectTab}
        variant="client" 
      />
    </div>
  );
}