/**
 * Client profile — account overview, wallet summary, editable company details,
 * and quick actions. Company name/about persist to client_profiles in Supabase.
 */
import { useEffect, useState } from 'react';

import {
  ArrowRightCircleIcon,
  BottomNav,
  ChevronRightIcon,
  ClipboardListIcon,
  CopyIcon,
  ShieldCheckIcon,
  WalletIcon,
  type MainTab,
} from '../components/ui';
import type { ClientAccountStatus } from './ClientDashboardScreen';
import { isSupabaseConfigured } from '../lib/supabase';
import { clientProfiles } from '../data/repo';
import styles from './ClientProfileScreen.module.css';

type Props = {
  clientId?: string;
  name: string;
  email: string;
  walletAddress?: string;
  accountStatus: ClientAccountStatus;
  walletBalance: number;
  totalFunded: number;
  totalSpent: number;
  onHold: number;
  onMyTasks: () => void;
  onFundWallet: () => void;
  onLogout: () => void;
  onTab: (tab: MainTab) => void;
};

const STATUS_STYLE: Record<ClientAccountStatus, { label: string; bg: string; color: string }> = {
  verified: { label: 'Verified', bg: '#dcfce7', color: '#107535' },
  pending: { label: 'Pending', bg: '#dee8fc', color: '#124cc9' },
  unverified: { label: 'Unverified', bg: '#fef3c7', color: '#b45309' },
};

function shortAddress(address?: string) {
  if (!address) return 'Not connected';
  return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-5)}` : address;
}

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function ClientProfileScreen({
  clientId,
  name,
  email,
  walletAddress,
  accountStatus,
  walletBalance,
  totalFunded,
  totalSpent,
  onHold,
  onMyTasks,
  onFundWallet,
  onLogout,
  onTab,
}: Props) {
  const displayName = name || email.split('@')[0] || 'Client';
  const initial = displayName.charAt(0).toUpperCase();
  const status = STATUS_STYLE[accountStatus];

  const [company, setCompany] = useState('');
  const [about, setAbout] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !clientId) return;
    clientProfiles
      .get(clientId)
      .then((row) => {
        if (row) {
          setCompany(row.company_name ?? '');
          setAbout(row.about ?? '');
        }
      })
      .catch(() => {});
  }, [clientId]);

  const saveCompany = async () => {
    if (!isSupabaseConfigured || !clientId) return;
    setSaving(true);
    setSaved(false);
    try {
      await clientProfiles.save({ user_id: clientId, company_name: company.trim(), about: about.trim() });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>{initial}</div>
          <p className={styles.name}>{displayName}</p>
          <div className={styles.roleRow}>
            <span className={styles.role}>Client account</span>
            <span className={styles.badge} style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          {company && <p className={styles.company}>{company}</p>}
        </div>

        <div className={styles.body}>
          {/* Wallet card */}
          <div className={styles.walletCard}>
            <div className={styles.walletTop}>
              <span className={styles.walletLabel}>Platform Wallet</span>
              <WalletIcon size={18} color="#ffffff" />
            </div>
            <p className={styles.walletBalance}>{money(walletBalance)}</p>
            <div className={styles.walletAddrRow}>
              <div>
                <span className={styles.walletAddrLabel}>Wallet Address</span>
                <p className={styles.walletAddr}>{shortAddress(walletAddress)}</p>
              </div>
              <CopyIcon size={16} color="#ffffff" />
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Total Funded</span>
              <span className={styles.statValue}>{money(totalFunded)}</span>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Total Spent</span>
              <span className={styles.statValue}>{money(totalSpent)}</span>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>On Hold</span>
              <span className={styles.statValue}>{money(onHold)}</span>
            </div>
          </div>

          {/* Company details */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Company details</p>
            <label className={styles.fieldLabel} htmlFor="company">Company name</label>
            <input
              id="company"
              className={styles.input}
              placeholder="e.g. Bright Startups Ltd."
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setSaved(false);
              }}
            />
            <label className={styles.fieldLabel} htmlFor="about">About</label>
            <textarea
              id="about"
              className={styles.textarea}
              rows={3}
              placeholder="What does your company do?"
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
                setSaved(false);
              }}
            />
            <button className={styles.saveBtn} onClick={saveCompany} disabled={saving}>
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save details'}
            </button>
          </div>

          {/* Actions */}
          <button className={`${styles.row} ${styles.rowFirst}`} onClick={onMyTasks}>
            <span className={styles.rowLeft}>
              <ClipboardListIcon size={18} color="#124cc9" />
              <span className={styles.rowLabel}>My tasks</span>
            </span>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </button>
          <button className={styles.row} onClick={onFundWallet}>
            <span className={styles.rowLeft}>
              <WalletIcon size={18} color="#124cc9" />
              <span className={styles.rowLabel}>Fund wallet</span>
            </span>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </button>
          <div className={styles.row}>
            <span className={styles.rowLeft}>
              <ShieldCheckIcon size={18} color="#107535" />
              <span className={styles.rowLabel}>Verification status</span>
            </span>
            <span className={styles.badge} style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>

          <button className={styles.logout} onClick={onLogout}>
            <span>Log Out</span>
            <ArrowRightCircleIcon size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>

      <BottomNav active="profile" onSelect={onTab} variant="client" />
    </div>
  );
}
