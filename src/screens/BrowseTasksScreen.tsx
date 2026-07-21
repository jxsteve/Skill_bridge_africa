import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BottomNav, MainTab, SearchIcon, SlidersIcon } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { TASKS, Task, TaskCategory } from '../data/marketplace';

const FILTERS: ('All' | TaskCategory)[] = ['All', 'Design', 'Development', 'Writing'];

type Props = {
  onOpenTask: (task: Task) => void;
  onTab: (tab: MainTab) => void;
};

export default function BrowseTasksScreen({ onOpenTask, onTab }: Props) {
  const insets = useScreenInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const tasks = useMemo(() => {
    return TASKS.filter((t) => {
      const matchesFilter = filter === 'All' || t.category === filter;
      const matchesQuery =
        query.trim() === '' ||
        t.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks....."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <View style={styles.filterButton}>
            <SlidersIcon size={20} />
          </View>
        </View>

        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const selected = f === filter;
            return (
              <Pressable
                key={f}
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterLabel, selected && styles.filterLabelActive]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tasks.map((task) => (
          <Pressable
            key={task.id}
            style={styles.card}
            onPress={() => onOpenTask(task)}
          >
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              {task.featured && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Featured</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardClient}>{task.client}</Text>
            <Text style={styles.cardMeta}>Due in {task.dueInDays} Days</Text>
            <Text style={styles.cardBudget}>Budget ${task.budget.toFixed(2)}</Text>
          </Pressable>
        ))}

        {tasks.length === 0 && (
          <Text style={styles.empty}>No tasks match your search.</Text>
        )}
      </ScrollView>

      <BottomNav active="tasks" onSelect={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  searchRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  search: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: 10, marginTop: 22 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: { backgroundColor: palette.blue50 },
  filterLabel: { color: '#6B7280', fontFamily: fonts.medium, fontSize: 14 },
  filterLabelActive: { color: palette.blue500, fontFamily: fonts.semiBold },
  card: {
    marginTop: 22,
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
  badge: {
    backgroundColor: '#93F0B6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { color: '#107535', fontFamily: fonts.semiBold, fontSize: 12 },
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
    marginTop: 40,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
