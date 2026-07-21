import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import PhoneFrame from './components/PhoneFrame';
import type { AccountType, MainTab } from './components/ui';
import { useAuth } from './auth/AuthProvider';
import { PROJECTS, TASKS } from './data/marketplace';
import {
  getCompletedProfile,
  loadLoginPrefs,
  markProfileCompleted,
  saveLoginPrefs,
} from './lib/prefs';
import type { StudentProfile } from './types/profile';

import AccountTypeScreen from './screens/AccountTypeScreen';
import BidAcceptedScreen from './screens/BidAcceptedScreen';
import BrowseTasksScreen from './screens/BrowseTasksScreen';
import LoginScreen from './screens/LoginScreen';
import MyBidsScreen from './screens/MyBidsScreen';
import MyProjectsScreen from './screens/MyProjectsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import PlaceBidScreen from './screens/PlaceBidScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import RegistrationScreen, {
  type RegistrationDetails,
} from './screens/RegistrationScreen';
import SplashScreen from './screens/SplashScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import StudentHomeScreen from './screens/StudentHomeScreen';
import SubmitWorkScreen from './screens/SubmitWorkScreen';
import VerificationProgressScreen from './screens/VerificationProgressScreen';
import VerificationSuccessScreen from './screens/VerificationSuccessScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import WelcomeToSkillBridgeScreen from './screens/WelcomeToSkillBridgeScreen';

const TAB_PATH: Record<MainTab, string> = {
  home: '/app',
  tasks: '/app/tasks',
  bids: '/app/bids',
  profile: '/app/profile',
};

export default function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<AccountType>('student');
  const [intent, setIntent] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [verified, setVerified] = useState(false);
  const [loginCompleted, setLoginCompleted] = useState(false);
  const [postWelcome, setPostWelcome] = useState<'app' | 'home'>('home');
  const [rememberedEmail, setRememberedEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const prefs = loadLoginPrefs();
    setRememberedEmail(prefs.email);
    setRememberMe(prefs.rememberMe);
  }, []);

  const walletAddress = auth.user?.walletAddress;

  const goTab = useCallback(
    (tab: MainTab) => navigate(TAB_PATH[tab]),
    [navigate],
  );

  const handleAccountType = useCallback(
    (type: AccountType) => {
      setAccountType(type);
      navigate('/register');
    },
    [navigate],
  );

  const handleRegister = useCallback(
    (details: RegistrationDetails) => {
      setIntent('signup');
      setEmail(details.email);
      setFullName(details.fullName);
      void auth.sendCode(details.email);
      navigate('/verify');
    },
    [auth, navigate],
  );

  const handleLogin = useCallback(
    (enteredEmail: string, remember: boolean) => {
      setIntent('login');
      setEmail(enteredEmail);
      setRememberMe(remember);
      saveLoginPrefs(enteredEmail, remember);
      setRememberedEmail(remember ? enteredEmail : '');
      void auth.sendCode(enteredEmail, { disableSignup: true });
      navigate('/verify');
    },
    [auth, navigate],
  );

  const handleVerify = useCallback(
    async (code: string) => {
      const user = await auth.verifyCode(email, code);
      if (!user) return false;
      if (intent === 'login') {
        const done = getCompletedProfile(email);
        setLoginCompleted(done !== null);
        if (done) setFullName(done.name);
      }
      return true;
    },
    [auth, email, intent],
  );

  const handleVerifiedContinue = useCallback(() => {
    if (intent === 'login' && loginCompleted) {
      setVerified(true);
      setPostWelcome('app');
    } else {
      setPostWelcome('home');
    }
    navigate('/welcome');
  }, [intent, loginCompleted, navigate]);

  const finishWelcome = useCallback(() => {
    navigate(postWelcome === 'app' ? '/app' : '/home');
  }, [postWelcome, navigate]);

  const handleProfileComplete = useCallback(
    (completed: StudentProfile) => {
      setProfile(completed);
      navigate(verified ? '/app' : '/verifying');
    },
    [verified, navigate],
  );

  const handleLogout = useCallback(() => {
    void auth.logout();
    setProfile(null);
    setVerified(false);
    setFullName('');
    navigate('/login');
  }, [auth, navigate]);

  const handleVerifiedDone = useCallback(() => {
    setVerified(true);
    markProfileCompleted(email, fullName);
    saveLoginPrefs(email, true);
    setRememberedEmail(email);
    navigate('/app');
  }, [email, fullName, navigate]);

  const common = { name: fullName, email, walletAddress };

  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<SplashScreen onDone={() => navigate('/onboarding')} />} />
        <Route
          path="/onboarding"
          element={<OnboardingScreen onFinish={() => navigate('/account-type')} />}
        />
        <Route
          path="/account-type"
          element={<AccountTypeScreen onSelect={handleAccountType} />}
        />
        <Route
          path="/register"
          element={
            <RegistrationScreen
              accountType={accountType}
              onSubmit={handleRegister}
              onLogin={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginScreen
              initialEmail={rememberedEmail}
              initialRememberMe={rememberMe}
              onSubmit={handleLogin}
              onSignUp={() => navigate('/account-type')}
            />
          }
        />
        <Route
          path="/verify"
          element={
            <VerifyEmailScreen
              email={email || 'JohnDoe@gmail.com'}
              onVerify={handleVerify}
              onContinue={handleVerifiedContinue}
              onResend={() => email && auth.sendCode(email)}
              onChangeEmail={() => navigate(intent === 'login' ? '/login' : '/register')}
            />
          }
        />
        <Route
          path="/welcome"
          element={<WelcomeToSkillBridgeScreen name={fullName} onDone={finishWelcome} />}
        />
        <Route
          path="/profile-setup"
          element={
            <ProfileSetupScreen initialProfile={profile} onComplete={handleProfileComplete} />
          }
        />
        <Route
          path="/verifying"
          element={<VerificationProgressScreen onDone={() => navigate('/verified')} />}
        />
        <Route
          path="/verified"
          element={
            <VerificationSuccessScreen walletAddress={walletAddress} onDone={handleVerifiedDone} />
          }
        />
        <Route
          path="/home"
          element={
            <StudentHomeScreen
              name={fullName}
              email={email}
              profile={profile}
              onCompleteProfile={() => navigate('/profile-setup')}
            />
          }
        />
        <Route
          path="/app"
          element={
            <StudentDashboardScreen
              {...common}
              avatarUri={profile?.avatarUri}
              onImproveProfile={() => navigate('/profile-setup')}
              onBrowseTasks={() => navigate('/app/tasks')}
              onOpenNotifications={() => navigate('/app/notifications')}
              onTab={goTab}
            />
          }
        />
        <Route
          path="/app/tasks"
          element={
            <BrowseTasksScreen
              onOpenTask={(id) => navigate(`/app/tasks/${id}`)}
              onTab={goTab}
            />
          }
        />
        <Route
          path="/app/notifications"
          element={<NotificationsScreen verified={verified} onBack={() => navigate(-1)} />}
        />
        <Route path="/app/tasks/:taskId" element={<TaskDetailRoute />} />
        <Route path="/app/tasks/:taskId/bid" element={<PlaceBidRoute />} />
        <Route path="/app/bid-accepted/:taskId" element={<BidAcceptedRoute />} />
        <Route
          path="/app/bids"
          element={<MyBidsScreen onTab={goTab} />}
        />
        <Route
          path="/app/projects"
          element={
            <MyProjectsScreen
              onOpenProject={(id) => navigate(`/app/projects/${id}/submit`)}
              onTab={goTab}
            />
          }
        />
        <Route path="/app/projects/:projectId/submit" element={<SubmitWorkRoute />} />
        <Route
          path="/app/profile"
          element={
            <ProfileScreen
              {...common}
              profile={profile}
              onEditProfile={() => navigate('/profile-setup')}
              onLogout={handleLogout}
              onTab={goTab}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  );

  function TaskDetailRoute() {
    const { taskId } = useParams();
    const task = TASKS.find((t) => t.id === taskId);
    if (!task) return <Navigate to="/app/tasks" replace />;
    return (
      <TaskDetailScreenLoader
        taskId={task.id}
        onBack={() => navigate(-1)}
        onPlaceBid={() => navigate(`/app/tasks/${task.id}/bid`)}
      />
    );
  }

  function PlaceBidRoute() {
    const { taskId } = useParams();
    return (
      <PlaceBidScreen
        onBack={() => navigate(-1)}
        onSubmit={() => navigate(`/app/bid-accepted/${taskId}`)}
      />
    );
  }

  function BidAcceptedRoute() {
    const { taskId } = useParams();
    const task = TASKS.find((t) => t.id === taskId);
    if (!task) return <Navigate to="/app/tasks" replace />;
    return (
      <BidAcceptedScreen
        task={task}
        onGoToTask={() => navigate('/app/projects')}
        onViewProjects={() => navigate('/app/projects')}
      />
    );
  }

  function SubmitWorkRoute() {
    const { projectId } = useParams();
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return <Navigate to="/app/projects" replace />;
    return <SubmitWorkScreen onBack={() => navigate(-1)} onSubmit={() => navigate('/app/projects')} />;
  }
}

// Small indirection so TaskDetail can look the task up by id.
import TaskDetailScreen from './screens/TaskDetailScreen';

function TaskDetailScreenLoader({
  taskId,
  onBack,
  onPlaceBid,
}: {
  taskId: string;
  onBack: () => void;
  onPlaceBid: () => void;
}) {
  const task = TASKS.find((t) => t.id === taskId)!;
  return <TaskDetailScreen task={task} onBack={onBack} onPlaceBid={onPlaceBid} />;
}
