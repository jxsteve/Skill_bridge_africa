import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CheckIcon, PrimaryButton } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  university: string;
  onDone: () => void;
};

/** Success screen shown once the profile wizard finishes. */
export default function ProfileCompleteScreen({ university, onDone }: Props) {
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
        <Text style={styles.title}>Profile Complete!</Text>
        <Text style={styles.message}>
          Great job — your professional profile is ready.
        </Text>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Verification in progress</Text>
          <Text style={styles.noticeBody}>
            We’ll verify your account and confirm your student details with{' '}
            {university}. You’ll get a verified badge once approved — verified
            profiles get more client trust and more jobs.
          </Text>
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
    fontSize: 28,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  noticeCard: {
    marginTop: 28,
    padding: 18,
    borderRadius: 16,
    backgroundColor: palette.blue50,
    alignSelf: 'stretch',
  },
  noticeTitle: {
    color: palette.blue600,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  noticeBody: {
    marginTop: 6,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
