import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OtpInput, PrimaryButton } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const RESEND_SECONDS = 45;

type Props = {
  email: string;
  /** Returns true when the code was accepted; false shows an error. */
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => void;
  onChangeEmail: () => void;
};

export default function VerifyEmailScreen({
  email,
  onVerify,
  onResend,
  onChangeEmail,
}: Props) {
  const insets = useScreenInsets();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = async () => {
    if (verifying) return;
    setVerifying(true);
    setError(false);
    const ok = await onVerify(code);
    setVerifying(false);
    if (!ok) {
      setError(true);
      setCode('');
    }
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    setError(false);
    onResend?.();
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const countdown = `00:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We’ve sent a 6-digit code to{'\n'}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.otp}>
        <OtpInput value={code} onChange={setCode} />
      </View>
      {error && <Text style={styles.error}>Invalid code. Please try again.</Text>}
      <Text style={styles.hint}>Didnt receive the code?</Text>
      <Pressable onPress={secondsLeft <= 0 ? handleResend : undefined} hitSlop={8}>
        <Text style={styles.resend}>
          Resend Code{secondsLeft > 0 ? ` (${countdown})` : ''}
        </Text>
      </Pressable>

      <View style={styles.spacer} />

      <PrimaryButton
        label="Verify Code"
        showIcon={false}
        fullWidth
        loading={verifying}
        onPress={handleVerify}
      />
      <Pressable onPress={onChangeEmail} hitSlop={8} style={styles.changeEmail}>
        <Text style={styles.changeEmailText}>Change Email</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 30,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 25,
  },
  email: {
    color: colors.titleDark,
    fontFamily: fonts.bold,
  },
  otp: {
    marginTop: 46,
  },
  error: {
    marginTop: 14,
    textAlign: 'center',
    color: '#DC2626',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  resend: {
    marginTop: 24,
    textAlign: 'center',
    color: palette.blue500,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
  changeEmail: {
    marginTop: 20,
    alignSelf: 'center',
  },
  changeEmailText: {
    color: palette.blue500,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
});
