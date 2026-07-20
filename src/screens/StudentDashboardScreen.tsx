import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BellIcon,
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const violet = '#6014E0';
const violetSoft = '#F9F6FE';
const green = '#16A34A';
const inactiveGrey = '#9CA3AF';

// The design labels the wallet as Solana; the underlying Privy wallet is
// currently Ethereum. Change this once the wallet network is finalised.
const WALLET_NETWORK = 'Solana';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  onImproveProfile: () => void;
};

function shortAddress(address?: string) {
  if (!address) return '6x1a7…x9kL2';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

export default function StudentDashboardScreen({
  name,
  email,
  walletAddress,
  onImproveProfile,
}: Props) {
  const insets = useScreenInsets();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/images/logo_mark.png')}
              style={styles.brandMark}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandWordmark}>
                <Text style={{ color: colors.primaryBlue }}>Skill</Text>
                <Text style={{ color: colors.brandGreen }}>Bridge</Text>
              </Text>
              <Text style={styles.brandAfrica}>–AFRICA–</Text>
            </View>
          </View>
          <Pressable hitSlop={8} style={styles.bell}>
            <BellIcon />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeLabel}>Welcome,</Text>
            <Text style={styles.welcomeName}>{displayName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initial}</Text>
            <View style={styles.onlineDot} />
          </View>
        </View>

        {/* Wallet */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Pressable hitSlop={8} onPress={() => setBalanceHidden((h) => !h)}>
              {balanceHidden ? (
                <EyeOffIcon size={20} color={colors.white} />
              ) : (
                <EyeIcon size={20} color={colors.white} />
              )}
            </Pressable>
          </View>
          <Text style={styles.walletBalance}>
            {balanceHidden ? '••••••' : '$0.00'}
          </Text>
          <View style={styles.walletAddressRow}>
            <View style={styles.walletAddressText}>
              <Text style={styles.walletAddressLabel}>
                Wallet Address ({WALLET_NETWORK})
              </Text>
              <Text style={styles.walletAddressValue}>
                {shortAddress(walletAddress)}
              </Text>
            </View>
            <Pressable hitSlop={8}>
              <CopyIcon />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Active Bids" value="0" chip={violetSoft}>
            <SearchIcon size={12} color={violet} />
          </Stat>
          <Stat label="Completed" value="0" chip="#DCFCE7">
            <CheckCircleIcon size={12} color={green} />
          </Stat>
          <Stat label="Earnings" value="$0.00" chip={violetSoft}>
            <BriefcaseBusinessIcon size={12} color={violet} />
          </Stat>
          <Stat label="Profile Views" value="0" chip="#FEF3C7">
            <EyeIcon size={12} color="#D97706" />
          </Stat>
        </View>

        {/* My Active Tasks — empty */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>My Active Tasks</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.emptyBlock}>
            <View style={styles.emptyIcon}>
              <ClipboardListIcon size={26} color={violet} />
            </View>
            <Text style={styles.emptyText}>
              No active tasks yet. Browse tasks and place a bid to get started.
            </Text>
          </View>
        </View>

        {/* Recent Activity — empty */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.emptyBlock}>
            <View style={styles.emptyIcon}>
              <BellIcon size={24} color={violet} />
            </View>
            <Text style={styles.emptyText}>
              No activity yet. Payments and updates will show up here.
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <QuickAction label="Browse Tasks">
              <SearchIcon size={18} color={violet} />
            </QuickAction>
            <QuickAction label="My Bids">
              <UsersIcon size={18} color={violet} />
            </QuickAction>
            <QuickAction label="Profile">
              <UserIcon size={18} color={violet} />
            </QuickAction>
          </View>
        </View>

        {/* Stand out */}
        <View style={styles.standOut}>
          <Text style={styles.standOutTitle}>Stand Out. Get Hired Faster!</Text>
          <Text style={styles.standOutBody}>
            Complete your profile and add a portfolio to increase your chances
          </Text>
          <Pressable style={styles.improveButton} onPress={onImproveProfile}>
            <Text style={styles.improveButtonLabel}>Improve Profile</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom - 14, 8) }]}>
        <View style={styles.navItem}>
          <HomeIcon size={22} color={violet} />
          <Text style={[styles.navLabel, { color: violet }]}>Home</Text>
        </View>
        <Pressable style={styles.navItem}>
          <ClipboardListIcon size={22} color={inactiveGrey} />
          <Text style={styles.navLabel}>Tasks</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <UsersIcon size={22} color={inactiveGrey} />
          <Text style={styles.navLabel}>Bids</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <UserIcon size={22} color={inactiveGrey} />
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  chip,
  children,
}: {
  label: string;
  value: string;
  chip: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        <View style={[styles.statIcon, { backgroundColor: chip }]}>{children}</View>
      </View>
    </View>
  );
}

function QuickAction({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Pressable style={styles.quickTile}>
      {children}
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandMark: {
    width: 17,
    height: 28,
  },
  brandWordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
  },
  brandAfrica: {
    color: colors.primaryBlue,
    fontFamily: fonts.bold,
    fontSize: 8,
    letterSpacing: 2,
    textAlign: 'center',
  },
  bell: {
    padding: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  welcomeRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeLabel: {
    color: '#6B7280',
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  welcomeName: {
    marginTop: 1,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 23,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 19,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  walletCard: {
    marginTop: 18,
    borderRadius: 16,
    padding: 18,
    backgroundColor: green,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLabel: {
    color: '#EAF7EF',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  walletBalance: {
    marginTop: 6,
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 32,
  },
  walletAddressRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  walletAddressText: {
    flex: 1,
  },
  walletAddressLabel: {
    color: '#D6EFE0',
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  walletAddressValue: {
    marginTop: 2,
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  statTile: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: violetSoft,
    borderWidth: 1,
    borderColor: '#EDE9F5',
  },
  statLabel: {
    color: '#4B5563',
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  statValueRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E9E7EF',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  viewAll: {
    color: violet,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  emptyBlock: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 6,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6B7280',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  quickRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  quickTile: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9E7EF',
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  quickLabel: {
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  standOut: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: violetSoft,
    borderWidth: 1,
    borderColor: '#E4DAF9',
  },
  standOutTitle: {
    color: violet,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  standOutBody: {
    marginTop: 6,
    color: '#4B5563',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  improveButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 10,
    backgroundColor: violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improveButtonLabel: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
    backgroundColor: colors.white,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    color: inactiveGrey,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
