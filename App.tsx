import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PhoneFrame from './src/components/PhoneFrame';
import { AccountType } from './src/components/ui';
import AccountTypeScreen from './src/screens/AccountTypeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { fontSources } from './src/theme/fonts';

type Phase =
  | 'splash'
  | 'onboarding'
  | 'accountType'
  | 'registration'
  | 'verifyEmail'
  | 'welcome';

export default function App() {
  const [fontsLoaded] = useFonts(fontSources);
  const [phase, setPhase] = useState<Phase>('splash');
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [email, setEmail] = useState('');
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
  const goToAccountType = useCallback(() => setPhase('accountType'), []);
  const goToWelcome = useCallback(() => setPhase('welcome'), []);

  const handleAccountType = useCallback((type: AccountType) => {
    setAccountType(type);
    setPhase('registration');
  }, []);

  const handleRegister = useCallback((enteredEmail: string) => {
    setEmail(enteredEmail.trim());
    setPhase('verifyEmail');
  }, []);

  const handleChangeEmail = useCallback(() => setPhase('registration'), []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PhoneFrame>
        <Animated.View style={[styles.root, { opacity }]}>
          {phase === 'splash' && <SplashScreen onDone={goToOnboarding} />}
          {phase === 'onboarding' && (
            <OnboardingScreen onFinish={goToAccountType} />
          )}
          {phase === 'accountType' && (
            <AccountTypeScreen onSelect={handleAccountType} />
          )}
          {phase === 'registration' && (
            <RegistrationScreen
              accountType={accountType}
              onSubmit={handleRegister}
              onLogin={goToWelcome}
            />
          )}
          {phase === 'verifyEmail' && (
            <VerifyEmailScreen
              email={email || 'JohnDoe@gmail.com'}
              onVerify={goToWelcome}
              onChangeEmail={handleChangeEmail}
            />
          )}
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
