import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CheckIcon, PrimaryButton, WalletIcon } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  walletAddress?: string;
  onDone: () => void;
};

function shortAddress(address?: string) {
  if (!address) return '6x1a7…x9kL2';
  return address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-5)}`
    : address;
}

/** Confirms verification and the newly created student wallet. */
export default function VerificationSuccessScreen({ walletAddress, onDone }: Props) {
  const insets = useScreenInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.body}>
        <View style={styles.checkOuter}>
          <View style={styles.checkInner}>
            <CheckIcon size={40} color={colors.white} strokeWidth={2.5} />
          </View>
        </View>
        <Text style={styles.title}>Verification Successful!</Text>
        <Text style={styles.message}>
          Your account is verified and you’re ready to start earning.
        </Text>

        <View style={styles.walletCard}>
          <View style={styles.walletIcon}>
            <WalletIcon size={22} color={palette.green500} />
          </View>
          <View style={styles.walletText}>
            <Text style={styles.walletTitle}>Dedicated wallet created</Text>
            <Text style={styles.walletBody}>
              A secure student wallet has been created for you.
            </Text>
            <Text style={styles.walletAddress} selectable>
              {shortAddress(walletAddress)}
            </Text>
          </View>
        </View>
      </View>

      <PrimaryButton
        label="Go to Dashboard"
        showIcon={false}
        fullWidth
        onPress={onDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
    paddingHorizontal: 24,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: palette.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 26,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 27,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  walletCard: {
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#E9FBF0',
    borderWidth: 1,
    borderColor: '#C4EED4',
    flexDirection: 'row',
    gap: 14,
    alignSelf: 'stretch',
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletText: {
    flex: 1,
  },
  walletTitle: {
    color: palette.green500,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  walletBody: {
    marginTop: 3,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  walletAddress: {
    marginTop: 8,
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
});
