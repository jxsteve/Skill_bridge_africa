import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AccountType,
  Checkbox,
  MailIcon,
  PhoneIcon,
  PrimaryButton,
  TextField,
  UserIcon,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export type RegistrationDetails = {
  fullName: string;
  email: string;
  phone: string;
};

type Props = {
  accountType: AccountType;
  /** Called with the form details; the app then emails a verification code. */
  onSubmit: (details: RegistrationDetails) => void | Promise<void>;
  onLogin: () => void;
};

export default function RegistrationScreen({ accountType, onSubmit, onLogin }: Props) {
  const insets = useScreenInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleLabel = accountType === 'student' ? 'Student' : 'Client';
  const canSubmit =
    fullName.trim().length > 0 && EMAIL_PATTERN.test(email.trim()) && agreed;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{roleLabel}{'\n'}Registration</Text>
        <Text style={styles.subtitle}>Create your account to get verified</Text>

        <View style={styles.form}>
          <TextField
            icon={<UserIcon />}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <TextField
            icon={<MailIcon />}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            icon={<PhoneIcon />}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.passwordless}>
          No password needed — we’ll email you a 6-digit code to verify your
          account.
        </Text>

        <View style={styles.consentRow}>
          <Checkbox checked={agreed} onToggle={() => setAgreed((a) => !a)} />
          <Text style={styles.consentText}>
            I agree to the{'  '}
            <Text style={styles.consentLink}>Terms & Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.submit}>
          <PrimaryButton
            label="Create Account"
            showIcon={false}
            fullWidth
            disabled={!canSubmit}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable onPress={onLogin} hitSlop={8}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 37,
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  form: {
    marginTop: 26,
    gap: 12,
  },
  passwordless: {
    marginTop: 16,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  consentRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consentText: {
    color: colors.titleDark,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  consentLink: {
    color: palette.blue500,
  },
  submit: {
    marginTop: 40,
  },
  loginRow: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  loginLink: {
    color: palette.blue500,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
