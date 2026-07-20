import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const HOLD_MS = 2400;

type Props = {
  name?: string;
  onDone: () => void;
};

/** Brief celebratory interstitial shown after verification. */
export default function WelcomeToSkillBridgeScreen({ name, onDone }: Props) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    const timer = setTimeout(onDone, HOLD_MS);
    return () => clearTimeout(timer);
  }, [scale, opacity, onDone]);

  const firstName = name?.trim().split(' ')[0];

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require('../../assets/images/logo_mark.png')}
          style={styles.logoMark}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.textWrap, { opacity }]}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.wordmark}>
          <Text style={{ color: colors.primaryBlue }}>Skill</Text>
          <Text style={{ color: colors.brandGreen }}>Bridge</Text>
        </Text>
        <Text style={styles.subtitle}>
          {firstName ? `Great to have you, ${firstName}.` : 'Great to have you.'}
        </Text>
      </Animated.View>
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
    width: 72,
    height: 118,
  },
  textWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  welcome: {
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 18,
  },
  wordmark: {
    marginTop: 4,
    fontFamily: fonts.extraBold,
    fontSize: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 14,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
