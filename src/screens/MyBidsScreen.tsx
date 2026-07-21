import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav, MainTab, SegmentedTabs } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { BIDS, BidStatus } from '../data/marketplace';

const TABS = ['Active (3)', 'Pending (1)', 'Won (2)'];
const GROUPS = ['Active', 'Pending', 'Won'] as const;

const STATUS_STYLE: Record<BidStatus, { bg: string; color: string }> = {
  Approved: { bg: '#93F0B6', color: '#107535' },
  Rejected: { bg: '#FDE0E0', color: '#DC2626' },
  Pending: { bg: '#DDE8FC', color: '#124CC9' },
};

type Props = {
  onTab: (tab: MainTab) => void;
};

export default function MyBidsScreen({ onTab }: Props) {
  const insets = useScreenInsets();
  const [active, setActive] = useState(0);

  const bids = useMemo(
    () => BIDS.filter((b) => b.group === GROUPS[active]),
    [active],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedTabs tabs={TABS} active={active} onChange={setActive} />

        <View style={styles.list}>
          {bids.map((bid) => {
            const badge = STATUS_STYLE[bid.status];
            return (
              <View key={bid.id} style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.cardTitle}>{bid.title}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>
                      {bid.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardClient}>{bid.client}</Text>
                <Text style={styles.cardMeta}>Due in {bid.dueInDays} Days</Text>
                <Text style={styles.cardBudget}>Budget ${bid.budget.toFixed(2)}</Text>
              </View>
            );
          })}
          {bids.length === 0 && (
            <Text style={styles.empty}>Nothing here yet.</Text>
          )}
        </View>
      </ScrollView>

      <BottomNav active="bids" onSelect={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  list: { marginTop: 20, gap: 14 },
  card: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  badge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 12 },
  cardClient: {
    marginTop: 6,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  cardMeta: {
    marginTop: 6,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  cardBudget: {
    marginTop: 8,
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 17,
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
