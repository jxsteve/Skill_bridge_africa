import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav, MainTab, SegmentedTabs } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PROJECTS, Project } from '../data/marketplace';

const TABS = ['In Progress (3)', 'Completed (2)'];
const STATUSES = ['In Progress', 'Completed'] as const;

type Props = {
  onOpenProject: (project: Project) => void;
  onTab: (tab: MainTab) => void;
};

export default function MyProjectsScreen({ onOpenProject, onTab }: Props) {
  const insets = useScreenInsets();
  const [active, setActive] = useState(0);

  const projects = useMemo(
    () => PROJECTS.filter((p) => p.status === STATUSES[active]),
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
          {projects.map((project) => (
            <Pressable
              key={project.id}
              style={styles.card}
              onPress={() => onOpenProject(project)}
            >
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{project.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{project.status}</Text>
                </View>
              </View>
              <Text style={styles.cardClient}>{project.client}</Text>
              <Text style={styles.cardMeta}>Due in {project.dueInDays} Days</Text>
              <Text style={styles.cardBudget}>Budget ${project.budget.toFixed(2)}</Text>
            </Pressable>
          ))}
          {projects.length === 0 && (
            <Text style={styles.empty}>No projects here yet.</Text>
          )}
        </View>
      </ScrollView>

      <BottomNav active="tasks" onSelect={onTab} />
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
    marginTop: 30,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
