import { useEffect, useState } from 'react';

import {
  ActivityIcon,
  ArrowRightCircleIcon,
  BottomNav,
  ChevronRightIcon,
  Chip,
  DollarSignIcon,
  EyeIcon,
  StarIcon,
  type MainTab,
} from '../components/ui';
import type { StudentProfile } from '../types/profile';
import { isSupabaseConfigured } from '../lib/supabase';
import { getStudentStats, type StudentStats } from '../data/marketplace-service';
import styles from './ProfileScreen.module.css';

const violet = '#6014E0';

const VERIF_LABEL: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Not approved',
  unverified: 'Pending',
};

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

type Props = {
  name: string;
  email: string;
  userId?: string;
  profile: StudentProfile | null;
  onEditProfile: () => void;
  onLogout: () => void;
  onTab: (tab: MainTab) => void;
};

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

const EMPTY_STATS: StudentStats = {
  projects: 0,
  clients: 0,
  rating: 0,
  reviews: 0,
  activeBids: 0,
  earnings: 0,
  verification: 'unverified',
};

export default function ProfileScreen({
  name,
  email,
  userId,
  profile,
  onEditProfile,
  onLogout,
  onTab,
}: Props) {
  const displayName = name || capitalize(email.split('@')[0]) || 'Student';
  const initial = displayName.charAt(0).toUpperCase();
  const role = profile?.skills[0] ?? 'Student';

  const [stats, setStats] = useState<StudentStats>(EMPTY_STATS);
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    getStudentStats(userId)
      .then(setStats)
      .catch(() => {});
  }, [userId]);

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
            <span className={styles.ratingText}>
              {stats.rating.toFixed(1)} ({stats.reviews} {stats.reviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Projects</span>
              <span className={styles.heroStatValue}>{stats.projects}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Clients</span>
              <span className={styles.heroStatValue}>{stats.clients}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Ratings</span>
              <span className={styles.heroStatValueRow}>
                <StarIcon size={13} />
                <span className={styles.heroStatValue}>{stats.rating.toFixed(1)}</span>
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
                <span className={styles.statValue}>{stats.activeBids}</span>
                <span className={styles.statIcon} style={{ background: '#EDE4FC' }}>
                  <ActivityIcon size={12} color={violet} />
                </span>
              </div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>Earnings</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{money(stats.earnings)}</span>
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

          {/* Details entered during profile setup */}
          {profile && (profile.university || profile.department || profile.skills.length > 0 || profile.bio) && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #eceef2',
                borderRadius: 14,
                padding: 16,
                marginBottom: 14,
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--title-dark)' }}>Details</p>
              {(profile.university || profile.department) && (
                <p style={{ margin: '10px 0 0', fontSize: 14, color: '#4b5563' }}>
                  {[profile.university, profile.department].filter(Boolean).join(' · ')}
                </p>
              )}
              {profile.linkedin && (
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', wordBreak: 'break-all' }}>
                  {profile.linkedin}
                </p>
              )}
              {profile.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {profile.skills.map((sk) => (
                    <Chip key={sk} label={sk} selected />
                  ))}
                </div>
              )}
              {profile.bio && (
                <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.5, color: '#374151' }}>
                  {profile.bio}
                </p>
              )}
            </div>
          )}

          {/* Verification */}
          <div className={`${styles.row} ${styles.rowFirst}`}>
            <span className={styles.rowLabel}>Verification status</span>
            <span className={styles.rowStatus}>{VERIF_LABEL[stats.verification] ?? 'Pending'}</span>
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
