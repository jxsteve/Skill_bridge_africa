import { ClipboardListIcon, HomeIcon, UserIcon, UsersIcon } from './icons';
import styles from './BottomNav.module.css';

export type MainTab = 'home' | 'tasks' | 'bids' | 'profile';

const violet = '#6014E0';
const inactive = '#9CA3AF';

const ITEMS: { tab: MainTab; label: string }[] = [
  { tab: 'home', label: 'Home' },
  { tab: 'tasks', label: 'Tasks' },
  { tab: 'bids', label: 'Bids' },
  { tab: 'profile', label: 'Profile' },
];

function TabIcon({ tab, color }: { tab: MainTab; color: string }) {
  switch (tab) {
    case 'home':
      return <HomeIcon size={22} color={color} />;
    case 'tasks':
      return <ClipboardListIcon size={22} color={color} />;
    case 'bids':
      return <UsersIcon size={22} color={color} />;
    case 'profile':
      return <UserIcon size={22} color={color} />;
  }
}

export function BottomNav({
  active,
  onSelect,
}: {
  active: MainTab;
  onSelect: (tab: MainTab) => void;
}) {
  return (
    <nav className={styles.nav}>
      {ITEMS.map(({ tab, label }) => {
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
