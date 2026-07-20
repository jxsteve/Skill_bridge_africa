import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const VERIFY_DURATION_MS = 6000;

type Props = {
  onDone: () => void;
};

/** Shown while the account is "being verified"; auto-advances after 6s. */
export default function VerificationProgressScreen({ onDone }: Props) {
  const insets = useScreenInsets();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    const timer = setTimeout(onDone, VERIFY_DURATION_MS);
    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [spin, onDone]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.spinnerWrap}>
        <View style={styles.ringTrack} />
        <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
      </View>
      <Text style={styles.title}>Verification in progress</Text>
      <Text style={styles.message}>
        We’re verifying your student details and setting up your dedicated
        wallet. This will only take a moment…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    borderColor: '#E3E8F0',
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: palette.blue500,
    borderRightColor: palette.blue500,
  },
  title: {
    marginTop: 32,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
  },
});
