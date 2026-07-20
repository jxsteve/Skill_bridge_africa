import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth';
import PhoneFrame from './src/components/PhoneFrame';
import { AccountType } from './src/components/ui';
import AccountTypeScreen from './src/screens/AccountTypeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import RegistrationScreen, {
  RegistrationDetails,
} from './src/screens/RegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import StudentHomeScreen from './src/screens/StudentHomeScreen';
import VerificationProgressScreen from './src/screens/VerificationProgressScreen';
import VerificationSuccessScreen from './src/screens/VerificationSuccessScreen';
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
  | 'verifyingProfile'
  | 'profileVerified'
  | 'studentHome'
  | 'studentDashboard'
  | 'welcome';

type AuthIntent = 'signup' | 'login';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontSources);

  // Never block the app on fonts: proceed once they load, on error, or after
  // a short timeout so a slow/failed font request can't leave a blank screen.
  const [fontTimedOut, setFontTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFontTimedOut(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const ready = fontsLoaded || fontError != null || fontTimedOut;

  if (!ready) {
    return <View style={styles.boot} />;
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
  const [verified, setVerified] = useState(false);
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
      return user !== null;
    },
    [auth, email, intent],
  );

  // Students land on their dashboard and complete the profile from there.
  const handleVerifiedContinue = useCallback(() => {
    setPhase(accountType === 'student' ? 'studentHome' : 'welcome');
  }, [accountType]);

  const handleProfileComplete = useCallback(
    (completed: StudentProfile) => {
      setProfile(completed);
      // Verify only the first time; later edits go straight to the dashboard.
      setPhase(verified ? 'studentDashboard' : 'verifyingProfile');
    },
    [verified],
  );

  const goToProfileVerified = useCallback(() => setPhase('profileVerified'), []);

  const handleVerifiedDone = useCallback(() => {
    setVerified(true);
    setPhase('studentDashboard');
  }, []);

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
          onContinue={handleVerifiedContinue}
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
      {phase === 'verifyingProfile' && (
        <VerificationProgressScreen onDone={goToProfileVerified} />
      )}
      {phase === 'profileVerified' && (
        <VerificationSuccessScreen
          walletAddress={auth.user?.walletAddress}
          onDone={handleVerifiedDone}
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
      {phase === 'studentDashboard' && (
        <StudentDashboardScreen
          name={fullName}
          email={email}
          walletAddress={auth.user?.walletAddress}
          onImproveProfile={goToProfileSetup}
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
  boot: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
});
