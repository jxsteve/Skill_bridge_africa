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

import { MailIcon, PrimaryButton, TextField } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Props = {
  /** Called with the email; the app then sends a login code. */
  onSubmit: (email: string) => void | Promise<void>;
  onSignUp: () => void;
};

export default function LoginScreen({ onSubmit, onSignUp }: Props) {
  const insets = useScreenInsets();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = EMAIL_PATTERN.test(email.trim());

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(email.trim());
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
  submit: {
    marginTop: 32,
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
