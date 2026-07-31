import { useEffect, useState, type ReactNode } from 'react';

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
import { isSupabaseConfigured } from '../lib/supabase';
import { getStudentWallet, listMyBids, listMyNotifications, listMyProjects } from '../data/marketplace-service';
import type { Project } from '../data/marketplace';
import type { AppNotification } from '../data/notifications';
import styles from './StudentDashboardScreen.module.css';

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

const violet = '#6014E0';

type Props = {
  name: string;
  email: string;
  userId?: string;
  walletAddress?: string;
  avatarUri?: string;
  onImproveProfile: () => void;
  onOpenNotifications: () => void;
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
  userId,
  walletAddress,
  avatarUri,
  onImproveProfile,
  onOpenNotifications,
  onBrowseTasks,
  onTab,
}: Props) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [activeBids, setActiveBids] = useState(0);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [activity, setActivity] = useState<AppNotification[]>([]);
  const displayName = name || email.split('@')[0] || 'Student';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    listMyBids(userId)
      .then((bids) => setActiveBids(bids.filter((b) => b.status === 'Pending').length))
      .catch(() => {});
    listMyProjects(userId)
      .then((projects) => setActiveProjects(projects.filter((p) => p.status === 'In Progress')))
      .catch(() => {});
    getStudentWallet(userId)
      .then((w) => {
        setBalance(w.balance);
        setEarnings(w.totalEarned);
      })
      .catch(() => {});
    listMyNotifications(userId, true)
      .then((n) => setActivity(n.slice(0, 4)))
      .catch(() => {});
  }, [userId]);

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
          <button className={styles.bell} onClick={onOpenNotifications}>
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
            {avatarUri ? (
              <img src={avatarUri} className={styles.avatarImg} alt="" />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
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
            {balanceHidden ? '••••••' : money(balance)}
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
          <Stat label="Active Bids" value={String(activeBids)} chip="#EDE4FC">
            <ActivityIcon size={12} color={violet} />
          </Stat>
          <Stat label="Earnings" value={money(earnings)} chip="#DCFCE7">
            <DollarSignIcon size={12} color="#16A34A" />
          </Stat>
          <Stat label="Profile Views" value="0" chip="#FEF3C7">
            <EyeIcon size={12} color="#D97706" />
          </Stat>
        </div>

        {/* Active tasks */}
        {activeProjects.length > 0 ? (
          <div className={styles.card}>
            <span className={styles.cardTitle}>Active Tasks ({activeProjects.length})</span>
            {activeProjects.map((p) => (
              <div key={p.id} className={styles.activeTaskRow}>
                <span className={styles.activeTaskTitle}>{p.title}</span>
                <span className={styles.activeTaskBudget}>${p.budget.toFixed(2)}</span>
              </div>
            ))}
            <button className={styles.outlineButton} onClick={() => onTab('tasks')}>
              View Tasks
            </button>
          </div>
        ) : (
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
        )}

        {/* Needs your attention — what just happened across your tasks */}
        {activity.length > 0 && (
          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={styles.cardTitle}>Needs your attention</span>
              <button
                onClick={onOpenNotifications}
                style={{ border: 'none', background: 'none', color: 'var(--primary-blue)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                View all
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
              {activity.map((n) => (
                <div
                  key={n.id}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid #f0f1f3' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: violet, marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{n.title}</p>
                    {n.body && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{n.body}</p>}
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: '#9ca3af' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
