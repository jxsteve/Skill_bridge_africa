import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth';
import PhoneFrame from './src/components/PhoneFrame';
import { AccountType } from './src/components/ui';
import AccountTypeScreen from './src/screens/AccountTypeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileCompleteScreen from './src/screens/ProfileCompleteScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import RegistrationScreen, {
  RegistrationDetails,
} from './src/screens/RegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import StudentHomeScreen from './src/screens/StudentHomeScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { fontSources } from './src/theme/fonts';
import { StudentProfile } from './src/types/profile';

type Phase =
  | 'splash'
  | 'onboarding'
  | 'accountType'
  | 'registration'
  | 'login'
  | 'verifyEmail'
  | 'profileSetup'
  | 'profileComplete'
  | 'studentHome'
  | 'welcome';

type AuthIntent = 'signup' | 'login';

export default function App() {
  const [fontsLoaded] = useFonts(fontSources);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <PhoneFrame>
          <Flow />
        </PhoneFrame>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function Flow() {
  const auth = useAuth();
  const [phase, setPhase] = useState<Phase>('splash');
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [intent, setIntent] = useState<AuthIntent>('signup');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
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
  const goToLogin = useCallback(() => setPhase('login'), []);

  const handleAccountType = useCallback((type: AccountType) => {
    setAccountType(type);
    setPhase('registration');
  }, []);

  const handleRegister = useCallback(
    async (details: RegistrationDetails) => {
      setIntent('signup');
      setEmail(details.email);
      setFullName(details.fullName);
      await auth.sendCode(details.email);
      setPhase('verifyEmail');
    },
    [auth],
  );

  const handleLogin = useCallback(
    async (enteredEmail: string) => {
      setIntent('login');
      setEmail(enteredEmail);
      await auth.sendCode(enteredEmail, { disableSignup: true });
      setPhase('verifyEmail');
    },
    [auth],
  );

  const handleVerify = useCallback(
    async (code: string) => {
      const user = await auth.verifyCode(email, code, {
        disableSignup: intent === 'login',
      });
      if (user) {
        // Students land on their dashboard and complete the profile from there.
        if (accountType === 'student') {
          setPhase('studentHome');
        } else {
          setPhase('welcome');
        }
        return true;
      }
      return false;
    },
    [auth, email, intent, accountType],
  );

  const handleProfileComplete = useCallback((completed: StudentProfile) => {
    setProfile(completed);
    setPhase('profileComplete');
  }, []);

  const goToStudentHome = useCallback(() => setPhase('studentHome'), []);

  const goToProfileSetup = useCallback(() => setPhase('profileSetup'), []);

  const handleResend = useCallback(() => {
    if (email) {
      void auth.sendCode(email);
    }
  }, [auth, email]);

  const handleChangeEmail = useCallback(
    () => setPhase(intent === 'login' ? 'login' : 'registration'),
    [intent],
  );

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      {phase === 'splash' && <SplashScreen onDone={goToOnboarding} />}
      {phase === 'onboarding' && <OnboardingScreen onFinish={goToAccountType} />}
      {phase === 'accountType' && (
        <AccountTypeScreen onSelect={handleAccountType} />
      )}
      {phase === 'registration' && (
        <RegistrationScreen
          accountType={accountType}
          onSubmit={handleRegister}
          onLogin={goToLogin}
        />
      )}
      {phase === 'login' && (
        <LoginScreen onSubmit={handleLogin} onSignUp={goToAccountType} />
      )}
      {phase === 'verifyEmail' && (
        <VerifyEmailScreen
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          onChangeEmail={handleChangeEmail}
        />
      )}
      {phase === 'profileSetup' && (
        <ProfileSetupScreen
          initialProfile={profile}
          onComplete={handleProfileComplete}
        />
      )}
      {phase === 'profileComplete' && profile && (
        <ProfileCompleteScreen
          university={profile.university}
          onDone={goToStudentHome}
        />
      )}
      {phase === 'studentHome' && (
        <StudentHomeScreen
          name={fullName}
          email={email}
          walletAddress={auth.user?.walletAddress}
          profile={profile}
          onCompleteProfile={goToProfileSetup}
        />
      )}
      {phase === 'welcome' && <WelcomeScreen walletAddress={auth.user?.walletAddress} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
