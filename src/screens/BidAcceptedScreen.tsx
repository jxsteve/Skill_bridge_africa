import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { CheckIcon, PrimaryButton } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { Task } from '../data/marketplace';

type Props = {
  task: Task;
  onGoToTask: () => void;
  onViewProjects: () => void;
};

// Small confetti specks scattered around the success ring.
const CONFETTI = [
  { x: 24, y: 40, c: '#F5C84B' },
  { x: 300, y: 30, c: '#93F0B6' },
  { x: 60, y: 120, c: '#F28B82' },
  { x: 320, y: 110, c: '#8AB4F8' },
  { x: 20, y: 150, c: '#F5C84B' },
  { x: 340, y: 160, c: '#93F0B6' },
  { x: 120, y: 20, c: '#8AB4F8' },
  { x: 250, y: 150, c: '#F5C84B' },
];

export default function BidAcceptedScreen({
  task,
  onGoToTask,
  onViewProjects,
}: Props) {
  const insets = useScreenInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.body}>
        <View style={styles.celebration}>
          <Svg
            width={360}
            height={200}
            viewBox="0 0 360 200"
            style={StyleSheet.absoluteFill}
          >
            {CONFETTI.map((c, i) => (
              <Circle key={i} cx={c.x} cy={c.y} r={7} fill={c.c} opacity={0.85} />
            ))}
          </Svg>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <CheckIcon size={48} color={colors.white} strokeWidth={2.5} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>Your Bid has been accepted</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{task.title}</Text>
          <Text style={styles.cardClient}>{task.client}</Text>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>Budget</Text>
              <Text style={styles.cardValue}>${task.budget.toFixed(2)}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardLabel}>Due date</Text>
              <Text style={styles.cardValue}>{task.dueDate}</Text>
            </View>
          </View>
        </View>
      </View>

      <PrimaryButton label="Go to Task" showIcon={false} fullWidth onPress={onGoToTask} />
      <Pressable onPress={onViewProjects} hitSlop={8} style={styles.viewAll}>
        <Text style={styles.viewAllText}>View all Projects</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase, paddingHorizontal: 24 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  celebration: {
    width: 360,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#93F0B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: palette.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 28,
  },
  subtitle: {
    marginTop: 8,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  card: {
    marginTop: 30,
    alignSelf: 'stretch',
    borderRadius: 16,
    padding: 20,
    backgroundColor: palette.blue50,
  },
  cardTitle: { color: colors.titleDark, fontFamily: fonts.bold, fontSize: 19 },
  cardClient: {
    marginTop: 4,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  cardRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRight: { alignItems: 'flex-end' },
  cardLabel: { color: colors.bodyGrey, fontFamily: fonts.regular, fontSize: 13 },
  cardValue: {
    marginTop: 4,
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  viewAll: { marginTop: 18, alignItems: 'center' },
  viewAllText: { color: palette.blue500, fontFamily: fonts.medium, fontSize: 15 },
});
