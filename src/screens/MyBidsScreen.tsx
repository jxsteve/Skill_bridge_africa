import { useMemo, useState } from 'react';

import { BottomNav, MainTab, SegmentedTabs } from '../components/ui';
import { BIDS, BidStatus } from '../data/marketplace';
import styles from './MyBidsScreen.module.css';

const GROUPS = ['Active', 'Pending', 'Won'] as const;
const TABS = GROUPS.map(
  (group) => `${group} (${BIDS.filter((b) => b.group === group).length})`,
);

const STATUS_STYLE: Record<BidStatus, { bg: string; color: string }> = {
  Approved: { bg: '#93F0B6', color: '#107535' },
  Rejected: { bg: '#FDE0E0', color: '#DC2626' },
  Pending: { bg: '#DDE8FC', color: '#124CC9' },
};

type Props = {
  onTab: (tab: MainTab) => void;
};

export default function MyBidsScreen({ onTab }: Props) {
  const [active, setActive] = useState(0);

  const bids = useMemo(() => BIDS.filter((b) => b.group === GROUPS[active]), [active]);

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <SegmentedTabs tabs={TABS} active={active} onChange={setActive} />

          <div className={styles.list}>
            {bids.map((bid) => {
              const badge = STATUS_STYLE[bid.status];
              return (
                <div key={bid.id} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardTitle}>{bid.title}</span>
                    <span className={styles.badge} style={{ backgroundColor: badge.bg }}>
                      <span className={styles.badgeText} style={{ color: badge.color }}>
                        {bid.status}
                      </span>
                    </span>
                  </div>
                  <p className={styles.cardClient}>{bid.client}</p>
                  <p className={styles.cardMeta}>Due in {bid.dueInDays} Days</p>
                  <p className={styles.cardBudget}>Budget ${bid.budget.toFixed(2)}</p>
                </div>
              );
            })}
            {bids.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}
          </div>
        </div>
      </div>

      <BottomNav active="bids" onSelect={onTab} />
    </div>
  );
}
