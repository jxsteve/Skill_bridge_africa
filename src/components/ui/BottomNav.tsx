import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useScreenInsets } from '../../hooks/useScreenInsets';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ClipboardListIcon, HomeIcon, UserIcon, UsersIcon } from './icons';

export type MainTab = 'home' | 'tasks' | 'bids' | 'profile';

const violet = '#6014E0';
const inactive = '#9CA3AF';

type Props = {
  active: MainTab;
  onSelect: (tab: MainTab) => void;
};

const ITEMS: { tab: MainTab; label: string }[] = [
  { tab: 'home', label: 'Home' },
  { tab: 'tasks', label: 'Tasks' },
  { tab: 'bids', label: 'Bids' },
  { tab: 'profile', label: 'Profile' },
];

export default function BottomNav({ active, onSelect }: Props) {
  const insets = useScreenInsets();
  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom - 14, 8) }]}>
      {ITEMS.map(({ tab, label }) => {
        const color = active === tab ? violet : inactive;
        return (
          <Pressable key={tab} style={styles.item} onPress={() => onSelect(tab)}>
            <TabIcon tab={tab} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
    backgroundColor: colors.white,
    paddingTop: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
