import { ClipboardListIcon, HomeIcon, UserIcon, UsersIcon, WalletIcon } from './icons';
import styles from './BottomNav.module.css';

// 'bids' is used for the student flow, 'wallet' for the client flow.
export type MainTab = 'home' | 'tasks' | 'bids' | 'wallet' | 'profile';
export type BottomNavVariant = 'student' | 'client';

const violet = '#6014E0';
const inactive = '#9CA3AF';

const ITEMS_BY_VARIANT: Record<BottomNavVariant, { tab: MainTab; label: string }[]> = {
  student: [
    { tab: 'home', label: 'Home' },
    { tab: 'tasks', label: 'Tasks' },
    { tab: 'bids', label: 'Bids' },
    { tab: 'profile', label: 'Profile' },
  ],
  client: [
    { tab: 'home', label: 'Home' },
    { tab: 'tasks', label: 'Tasks' },
    { tab: 'wallet', label: 'wallet' },
    { tab: 'profile', label: 'Profile' },
  ],
};

function TabIcon({ tab, color }: { tab: MainTab; color: string }) {
  switch (tab) {
    case 'home':
      return <HomeIcon size={22} color={color} />;
    case 'tasks':
      return <ClipboardListIcon size={22} color={color} />;
    case 'bids':
      return <UsersIcon size={22} color={color} />;
    case 'wallet':
      return <WalletIcon size={22} color={color} />;
    case 'profile':
      return <UserIcon size={22} color={color} />;
  }
}

export function BottomNav({
  active,
  onSelect,
  variant = 'student',
}: {
  active: MainTab;
  onSelect: (tab: MainTab) => void;
  variant?: BottomNavVariant;
}) {
  const items = ITEMS_BY_VARIANT[variant];

  return (
    <nav className={styles.nav}>
      {items.map(({ tab, label }) => {
        const color = active === tab ? violet : inactive;
        return (
          <button key={tab} className={styles.item} onClick={() => onSelect(tab)}>
            <TabIcon tab={tab} color={color} />
            <span className={styles.label} style={{ color }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}