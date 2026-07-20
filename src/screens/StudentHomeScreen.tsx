import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ActivityIcon,
  BellIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  DollarSignIcon,
  EyeIcon,
  HomeIcon,
  IdCardIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { StudentProfile } from '../types/profile';

// Design accent palette for the student dashboard.
const violet = '#6014E0';
const violetSoft = '#F9F6FE';
const violetChip = '#EDE4FC';
const cardBorder = '#EDE9F5';
const green = '#16A34A';
const greenChip = '#DCFCE7';
const amber = '#D97706';
const amberChip = '#FEF3C7';
const inactiveGrey = '#9CA3AF';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  profile: StudentProfile | null;
  onCompleteProfile: () => void;
};

/** Signup alone earns the base completion shown in the design. */
export function profileCompletion(profile: StudentProfile | null): number {
  let percent = 40;
  if (!profile) return percent;
  if (profile.university && profile.course && profile.level) percent += 20;
  if (profile.skills.length > 0) percent += 15;
  if (profile.bio) percent += 15;
  if (profile.portfolio.length > 0) percent += 10;
  return Math.min(percent, 100);
}

function shortAddress(address: string) {
  return address.length > 14
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address;
}

export default function StudentHomeScreen({
  name,
  email,
  walletAddress,
  profile,
  onCompleteProfile,
}: Props) {
  const insets = useScreenInsets();
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();
  const completion = profileCompletion(profile);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: brand + notifications */}
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
          <Pressable hitSlop={8}>
            <BellIcon />
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
          </View>
        </View>

        {/* Complete your profile */}
        {completion < 100 && (
          <View style={[styles.card, styles.softCard]}>
            <Text style={styles.cardTitle}>Complete Your Profile</Text>
            <Text style={styles.cardBody}>
              Finish setting up your profile to{'\n'}unlock personalised
              opportunities
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${completion}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{completion}%</Text>
            </View>
            <Pressable style={styles.primaryButton} onPress={onCompleteProfile}>
              <Text style={styles.primaryButtonLabel}>Complete Profile</Text>
            </Pressable>
          </View>
        )}

        {/* Wallet */}
        <View style={[styles.card, styles.softCard]}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <ChevronRightIcon size={18} color={colors.titleDark} />
          </View>
          <View style={styles.walletBalanceRow}>
            <Text style={styles.walletBalance}>$0.00</Text>
            <View style={styles.walletIconCircle}>
              <WalletIcon />
            </View>
          </View>
          <Text style={styles.walletHint}>
            {walletAddress
              ? `Your wallet is ready — ${shortAddress(walletAddress)}`
              : 'Complete your profile to create\nyour wallet and receive payments'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Active Bids</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>0</Text>
              <View style={[styles.statIcon, { backgroundColor: violetChip }]}>
                <ActivityIcon size={12} />
              </View>
            </View>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Earnings</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>$0.00</Text>
              <View style={[styles.statIcon, { backgroundColor: greenChip }]}>
                <DollarSignIcon size={12} />
              </View>
            </View>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Profile Views</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>0</Text>
              <View style={[styles.statIcon, { backgroundColor: amberChip }]}>
                <EyeIcon size={12} color={amber} />
              </View>
            </View>
          </View>
        </View>

        {/* No active tasks */}
        <View style={[styles.card, styles.outlineCard]}>
          <Text style={styles.cardTitleSmall}>No Active Tasks</Text>
          <View style={styles.tasksEmpty}>
            <View style={styles.tasksIconWrap}>
              <ClipboardListIcon size={44} />
            </View>
            <Text style={styles.tasksEmptyText}>
              You don’t have any active tasks yet.{'\n'}Browse tasks and place a
              bid
            </Text>
            <Pressable style={styles.outlineButton}>
              <Text style={styles.outlineButtonLabel}>Browse Tasks</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick actions */}
        <View style={[styles.card, styles.outlineCard]}>
          <Text style={styles.cardTitleSmall}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <Pressable style={styles.quickTile}>
              <SearchIcon size={18} />
              <Text style={styles.quickLabel}>Browse Tasks</Text>
            </Pressable>
            <Pressable style={styles.quickTile}>
              <UsersIcon size={18} />
              <Text style={styles.quickLabel}>My Bids</Text>
            </Pressable>
            <Pressable style={styles.quickTile}>
              <UserIcon size={18} color={colors.titleDark} />
              <Text style={styles.quickLabel}>Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* Tips */}
        <View style={[styles.card, styles.outlineCard]}>
          <Text style={styles.cardTitleSmall}>Tips to Get Started</Text>
          <View style={styles.tipsList}>
            <Pressable style={styles.tipRow} onPress={onCompleteProfile}>
              <View style={styles.tipIcon}>
                <ActivityIcon size={16} />
              </View>
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>Complete your Profile</Text>
                <Text style={styles.tipBody}>Add your skills, bio and portfolio</Text>
              </View>
              <ChevronRightIcon size={18} color={violet} />
            </Pressable>
            <Pressable style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <IdCardIcon size={16} />
              </View>
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>Verify your school ID</Text>
                <Text style={styles.tipBody}>Increase trust and get more jobs</Text>
              </View>
              <ChevronRightIcon size={18} color={violet} />
            </Pressable>
            <Pressable style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <MessageSquareIcon size={16} />
              </View>
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>Browse tasks and place a bid</Text>
                <Text style={styles.tipBody}>
                  Find opportunities that match your skills
                </Text>
              </View>
              <ChevronRightIcon size={18} color={violet} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom navigation */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 26,
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
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  softCard: {
    backgroundColor: violetSoft,
    borderWidth: 1,
    borderColor: cardBorder,
  },
  outlineCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E9E7EF',
  },
  cardTitle: {
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 17,
  },
  cardTitleSmall: {
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  cardBody: {
    marginTop: 6,
    color: '#6B7280',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  progressRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D9D3E5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: violet,
  },
  progressLabel: {
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    backgroundColor: violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLabel: {
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  walletBalanceRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletBalance: {
    color: colors.titleDark,
    fontFamily: fonts.extraBold,
    fontSize: 30,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: violetChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletHint: {
    marginTop: 12,
    color: '#4B5563',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statTile: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: violetSoft,
    borderWidth: 1,
    borderColor: cardBorder,
  },
  statLabel: {
    color: '#4B5563',
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  statValueRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statValue: {
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksEmpty: {
    marginTop: 12,
    alignItems: 'center',
  },
  tasksIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: violetChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksEmptyText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#4B5563',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  outlineButton: {
    marginTop: 16,
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonLabel: {
    color: violet,
    fontFamily: fonts.semiBold,
    fontSize: 15,
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
  tipsList: {
    marginTop: 10,
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: violetSoft,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: violetChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    color: violet,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  tipBody: {
    marginTop: 1,
    color: '#6B7280',
    fontFamily: fonts.regular,
    fontSize: 12,
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
