import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const SPLASH_DURATION_MS = 2800;

type Props = {
  onDone: () => void;
};

export default function SplashScreen({ onDone }: Props) {
  const [{ width, height }, setSize] = useState({ width: 390, height: 844 });

  useEffect(() => {
    const timer = setTimeout(onDone, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          <RadialGradient id="blob" cx="50%" cy="50%" r="50%">
            <Stop offset="0.45" stopColor="#E9F1F3" stopOpacity="1" />
            <Stop offset="1" stopColor="#E9F1F3" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E2EEF8" stopOpacity="1" />
            <Stop offset="0.55" stopColor="#EBF3F8" stopOpacity="1" />
            <Stop offset="1" stopColor="#EBF3F8" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={60} cy={80} r={110} fill="url(#blob)" />
        <Circle cx={width - 35} cy={height - 100} r={100} fill="url(#blob)" />
        <Circle cx={width / 2} cy={height / 2 - 24} r={230} fill="url(#glow)" />
      </Svg>

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/logo_mark.png')}
          style={styles.logoMark}
          resizeMode="contain"
        />
        <Text style={styles.wordmark}>
          <Text style={styles.wordmarkSkill}>Skill</Text>
          <Text style={styles.wordmarkBridge}>Bridge</Text>
        </Text>
        <Text style={styles.africa}>–AFRICA–</Text>
        <Text style={styles.tagline}>Your Skills. Our Bridge</Text>
      </View>
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
  content: {
    alignItems: 'center',
    transform: [{ translateY: -24 }],
  },
  logoMark: {
    width: 66,
    height: 108,
    marginBottom: 16,
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  wordmarkSkill: {
    color: colors.primaryBlue,
  },
  wordmarkBridge: {
    color: colors.brandGreen,
  },
  africa: {
    marginTop: 8,
    color: colors.primaryBlue,
    fontFamily: fonts.bold,
    fontSize: 19,
    letterSpacing: 4,
  },
  tagline: {
    marginTop: 34,
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 17,
  },
});
