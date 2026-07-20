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

import { Checkbox, MailIcon, PrimaryButton, TextField } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Props = {
  /** Prefilled email from a previous "remember me" login. */
  initialEmail?: string;
  initialRememberMe?: boolean;
  /** Called with the email and whether to remember it for next time. */
  onSubmit: (email: string, rememberMe: boolean) => void | Promise<void>;
  onSignUp: () => void;
};

export default function LoginScreen({
  initialEmail = '',
  initialRememberMe = true,
  onSubmit,
  onSignUp,
}: Props) {
  const insets = useScreenInsets();
  const [email, setEmail] = useState(initialEmail);
  const [rememberMe, setRememberMe] = useState(initialRememberMe);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = EMAIL_PATTERN.test(email.trim());

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(email.trim(), rememberMe);
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login with your email — we’ll send you{'\n'}a 6-digit code
        </Text>

        <View style={styles.form}>
          <TextField
            icon={<MailIcon />}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.rememberRow}>
          <Checkbox checked={rememberMe} onToggle={() => setRememberMe((r) => !r)} />
          <Text style={styles.rememberText}>Remember my email</Text>
        </View>

        <View style={styles.submit}>
          <PrimaryButton
            label="Send Login Code"
            showIcon={false}
            fullWidth
            disabled={!canSubmit}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don’t have an account? </Text>
          <Pressable onPress={onSignUp} hitSlop={8}>
            <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginTop: 14,
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
  },
  form: {
    marginTop: 34,
  },
  rememberRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rememberText: {
    color: colors.titleDark,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  submit: {
    marginTop: 28,
  },
  signUpRow: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  signUpLink: {
    color: palette.blue500,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
