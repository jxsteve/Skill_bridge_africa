import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PhoneFrame from './src/components/PhoneFrame';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { fontSources } from './src/theme/fonts';

type Phase = 'splash' | 'onboarding' | 'welcome';

export default function App() {
  const [fontsLoaded] = useFonts(fontSources);
  const [phase, setPhase] = useState<Phase>('splash');
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [phase, opacity]);

  const goToOnboarding = useCallback(() => setPhase('onboarding'), []);
  const goToWelcome = useCallback(() => setPhase('welcome'), []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PhoneFrame>
        <Animated.View style={[styles.root, { opacity }]}>
          {phase === 'splash' && <SplashScreen onDone={goToOnboarding} />}
          {phase === 'onboarding' && <OnboardingScreen onFinish={goToWelcome} />}
          {phase === 'welcome' && <WelcomeScreen />}
        </Animated.View>
      </PhoneFrame>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
