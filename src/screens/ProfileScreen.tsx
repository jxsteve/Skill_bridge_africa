import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav, MainTab, ChevronRightIcon } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  onEditProfile: () => void;
  onTab: (tab: MainTab) => void;
};

function shortAddress(address?: string) {
  if (!address) return 'Not yet created';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

export default function ProfileScreen({
  name,
  email,
  walletAddress,
  onEditProfile,
  onTab,
}: Props) {
  const insets = useScreenInsets();
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Wallet address</Text>
          <Text style={styles.walletValue} selectable>
            {shortAddress(walletAddress)}
          </Text>
        </View>

        <Pressable style={styles.row} onPress={onEditProfile}>
          <Text style={styles.rowLabel}>Edit profile</Text>
          <ChevronRightIcon size={18} color="#9CA3AF" />
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Verification status</Text>
          <Text style={styles.rowValue}>Pending</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Help & support</Text>
          <ChevronRightIcon size={18} color="#9CA3AF" />
        </Pressable>
      </ScrollView>

      <BottomNav active="profile" onSelect={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  header: { alignItems: 'center' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6014E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: colors.white, fontFamily: fonts.bold, fontSize: 34 },
  name: {
    marginTop: 14,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  email: {
    marginTop: 2,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  walletCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: palette.blue50,
  },
  walletLabel: { color: palette.blue600, fontFamily: fonts.medium, fontSize: 13 },
  walletValue: {
    marginTop: 4,
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  row: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAECEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { color: colors.titleDark, fontFamily: fonts.medium, fontSize: 15 },
  rowValue: { color: '#D97706', fontFamily: fonts.semiBold, fontSize: 14 },
});
