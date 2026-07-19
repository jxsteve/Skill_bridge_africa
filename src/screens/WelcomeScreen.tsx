import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

/** Landing stub shown after onboarding. Auth and home flows plug in here. */
export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo_mark.png')}
        style={styles.logoMark}
        resizeMode="contain"
      />
      <Text style={styles.wordmark}>
        <Text style={{ color: colors.primaryBlue }}>Skill</Text>
        <Text style={{ color: colors.brandGreen }}>Bridge</Text>
      </Text>
      <Text style={styles.message}>Welcome! Your journey starts here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 56,
    height: 92,
    marginBottom: 20,
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
  },
  message: {
    marginTop: 12,
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});
