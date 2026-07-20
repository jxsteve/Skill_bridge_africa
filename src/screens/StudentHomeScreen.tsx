import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip, GraduationCapIcon } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { StudentProfile } from '../types/profile';

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  profile: StudentProfile;
};

function shortAddress(address?: string) {
  if (!address) return 'Provisioning…';
  return address.length > 14
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

export default function StudentHomeScreen({
  name,
  email,
  walletAddress,
  profile,
}: Props) {
  const insets = useScreenInsets();
  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hi, {displayName}</Text>
          <Text style={styles.headerSub}>
            {profile.course} • {profile.level}
          </Text>
        </View>
        <View
          style={[
            styles.availabilityPill,
            !profile.available && styles.availabilityPillOff,
          ]}
        >
          <Text
            style={[
              styles.availabilityPillText,
              !profile.available && styles.availabilityPillTextOff,
            ]}
          >
            {profile.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={styles.verificationCard}>
        <GraduationCapIcon size={34} color={palette.blue600} />
        <View style={styles.verificationText}>
          <Text style={styles.verificationTitle}>Verification pending</Text>
          <Text style={styles.verificationBody}>
            We’re confirming your details at {profile.university}. You’ll get a
            verified badge once approved.
          </Text>
        </View>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Wallet balance</Text>
        <Text style={styles.walletBalance}>₦0.00</Text>
        <Text style={styles.walletAddress} selectable>
          {shortAddress(walletAddress)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your skills</Text>
      <View style={styles.chipWrap}>
        {profile.skills.map((skill) => (
          <Chip key={skill} label={skill} selected />
        ))}
      </View>

      {profile.bio.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>About you</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>Portfolio</Text>
      {profile.portfolio.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.portfolioRow}>
            {profile.portfolio.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.portfolioImage} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.emptyPortfolio}>
          No work added yet — add portfolio pieces so clients can see what you
          can do.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
  },
  content: {
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  headerSub: {
    marginTop: 1,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  availabilityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: palette.green50,
  },
  availabilityPillOff: {
    backgroundColor: palette.gray100,
  },
  availabilityPillText: {
    color: palette.green500,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  availabilityPillTextOff: {
    color: palette.gray400,
  },
  verificationCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: palette.blue50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    color: palette.blue600,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  verificationBody: {
    marginTop: 3,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  walletCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: palette.blue700,
  },
  walletLabel: {
    color: palette.blue100,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  walletBalance: {
    marginTop: 6,
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 30,
  },
  walletAddress: {
    marginTop: 10,
    color: palette.blue200,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 17,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bio: {
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  portfolioRow: {
    flexDirection: 'row',
    gap: 12,
  },
  portfolioImage: {
    width: 128,
    height: 128,
    borderRadius: 12,
  },
  emptyPortfolio: {
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
