import {
  ActivityIcon,
  BellIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClipboardListIcon,
  DollarSignIcon,
} from '../components/ui';
import { buildNotifications, type NotificationKind } from '../data/notifications';
import styles from './NotificationsScreen.module.css';

type Props = {
  verified: boolean;
  onBack: () => void;
};

const KIND_STYLE: Record<NotificationKind, { bg: string; color: string }> = {
  verification: { bg: '#DCFCE7', color: '#16A34A' },
  bid: { bg: '#EDE4FC', color: '#6014E0' },
  job: { bg: '#DEE8FC', color: '#124CC9' },
  payment: { bg: '#DCFCE7', color: '#16A34A' },
};

function KindIcon({ kind, color }: { kind: NotificationKind; color: string }) {
  switch (kind) {
    case 'verification':
      return <CheckCircleIcon size={18} color={color} />;
    case 'bid':
      return <ActivityIcon size={18} color={color} />;
    case 'job':
      return <ClipboardListIcon size={18} color={color} />;
    case 'payment':
      return <DollarSignIcon size={18} color={color} />;
  }
}

export default function NotificationsScreen({ verified, onBack }: Props) {
  const notifications = buildNotifications(verified);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack}>
          <ChevronLeftIcon />
        </button>
        <p className={styles.title}>Notifications</p>
        <span className={styles.headerSpacer} />
      </div>

      <div className={styles.scroll}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <BellIcon size={26} color="#6014E0" />
            </span>
            <p className={styles.emptyText}>
              Nothing here yet. Approved bids, completed jobs and escrow
              payments will show up here.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifications.map((item) => {
              const style = KIND_STYLE[item.kind];
              return (
                <div key={item.id} className={styles.row}>
                  <span className={styles.rowIcon} style={{ background: style.bg }}>
                    <KindIcon kind={item.kind} color={style.color} />
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitleLine}>
                      <span className={styles.rowTitle}>{item.title}</span>
                      <span className={styles.rowTime}>{item.time}</span>
                    </span>
                    <span className={styles.rowBody}>{item.body}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
