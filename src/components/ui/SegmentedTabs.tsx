import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  tabs: string[];
  active: number;
  onChange: (index: number) => void;
};

/** Pill-style segmented control used on the Bids and Projects screens. */
export default function SegmentedTabs({ tabs, active, onChange }: Props) {
  return (
    <View style={styles.row}>
      {tabs.map((tab, i) => {
        const selected = i === active;
        return (
          <Pressable
            key={tab}
            style={[styles.tab, selected && styles.tabActive]}
            onPress={() => onChange(i)}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{tab}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: palette.blue50,
  },
  label: {
    color: '#6B7280',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  labelActive: {
    color: palette.blue500,
    fontFamily: fonts.semiBold,
  },
});
