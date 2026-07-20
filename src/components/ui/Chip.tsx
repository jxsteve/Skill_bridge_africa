import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** Selectable pill chip used for skills and quick choices. */
export default function Chip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.gray300,
    backgroundColor: palette.gray50,
  },
  chipSelected: {
    borderColor: palette.blue500,
    backgroundColor: palette.blue50,
  },
  label: {
    color: palette.textSecondary,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  labelSelected: {
    color: palette.blue600,
  },
});
