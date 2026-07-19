import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { BriefcaseBusinessIcon, ChevronRightIcon, GraduationCapIcon } from './icons';

export type AccountType = 'student' | 'client';

type Props = {
  type: AccountType;
  selected?: boolean;
  onPress?: () => void;
};

const CARD_CONTENT = {
  student: {
    title: 'I’m a Student',
    description: 'I want to showcase my skills and earn.',
    background: palette.blue50,
    accent: palette.blue600,
    border: palette.blue500,
  },
  client: {
    title: 'I’m a Client',
    description: 'I want to Hire verified Students.',
    background: palette.green50,
    accent: palette.green500,
    border: palette.green500,
  },
} as const;

/** Role picker card for sign-up: Student (blue) or Client (green). */
export default function AccountTypeCard({ type, selected = false, onPress }: Props) {
  const content = CARD_CONTENT[type];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed && !selected ? palette.gray50 : content.background },
        selected && { borderWidth: 1, borderColor: content.border },
      ]}
    >
      <View style={styles.icon}>
        {type === 'student' ? (
          <GraduationCapIcon size={56} color={content.accent} />
        ) : (
          <BriefcaseBusinessIcon size={56} color={content.accent} />
        )}
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: content.accent }]}>{content.title}</Text>
        <View style={styles.row}>
          <Text style={styles.description}>{content.description}</Text>
          <ChevronRightIcon size={20} color={palette.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  icon: {
    width: 56,
    height: 56,
  },
  body: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 28,
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  description: {
    flex: 1,
    maxWidth: 191,
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
});
