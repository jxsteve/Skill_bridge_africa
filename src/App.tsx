import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import PhoneFrame from './components/PhoneFrame';
import type { AccountType, MainTab } from './components/ui';
import { BottomNav } from './components/ui';
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

// --- Client flow screens ---
import ClientDashboardScreen, {
  type ClientAccountStatus,
} from './screens/ClientDashboardScreen';
import FundPlatformWalletScreen from './screens/FundPlatformWalletScreen';
import ClientVerificationProgressScreen from './screens/ClientVerificationProgressScreen';
import ClientVerificationSuccessScreen from './screens/ClientVerificationSuccessScreen';
import CreateTaskScreen, { type NewTaskDetails } from './screens/CreateTaskScreen';
import ReviewTaskScreen from './screens/ReviewTaskScreen';
import TaskUnderReviewScreen from './screens/TaskUnderReviewScreen';
import StudentAssignedScreen, { type AssignedStudent } from './screens/StudentAssignedScreen';
import TaskInProgressScreen from './screens/TaskInProgressScreen';
import WorkSubmittedScreen from './screens/WorkSubmittedScreen';
import SubmissionUnderReviewScreen from './screens/SubmissionUnderReviewScreen';
import WorkReadyForReviewScreen from './screens/WorkReadyForReviewScreen';
import ReviewWorkScreen from './screens/ReviewWorkScreen';
import WorkApprovedScreen from './screens/WorkApprovedScreen';
import PaymentReleasedScreen from './screens/PaymentReleasedScreen';
import RateExperienceScreen from './screens/RateExperienceScreen';

const TAB_PATH: Record<MainTab, string> = {
  home: '/app',
  tasks: '/app/tasks',
  bids: '/app/bids',
  wallet: '/app/wallet', // not used on the student flow
  profile: '/app/profile',
};

const CLIENT_TAB_PATH: Record<MainTab, string> = {
  home: '/client/app',
  tasks: '/client/tasks',
  bids: '/client/app', // not used on the client flow
  wallet: '/client/wallet',
  profile: '/client/profile',
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

  // --- Client-flow specific state ---
  const [clientAccountStatus, setClientAccountStatus] =
    useState<ClientAccountStatus>('unverified');
  const [clientWalletBalance, setClientWalletBalance] = useState(0);
  const [clientWalletAddress] = useState('9x4a6vQeUZ9pM2tRwYbN4KcHjD8sXx3kw1');
  const [draftTask, setDraftTask] = useState<NewTaskDetails | null>(null);

  // Mock assigned-student data. Replace with a real API response once the
  // backend can tell us who was assigned to a given task.
  const [assignedStudent] = useState<AssignedStudent>({
    name: 'Miracle Igboanusi',
    role: 'UI/UX Designer',
    rating: 4.8,
    reviewCount: 32,
    school: 'University of Lagos',
    skills: ['UI/UX Design', 'Figma', 'Landing Page'],
  });

  useEffect(() => {
    const prefs = loadLoginPrefs();
    setRememberedEmail(prefs.email);
    setRememberMe(prefs.rememberMe);
  }, []);

  const walletAddress = auth.user?.walletAddress;
  const isClient = accountType === 'client';

  const goTab = useCallback(
    (tab: MainTab) => navigate(TAB_PATH[tab]),
    [navigate],
  );

  const goClientTab = useCallback(
    (tab: MainTab) => navigate(CLIENT_TAB_PATH[tab]),
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
    // Client accounts skip the student profile-setup/verifying screens —
    // the client dashboard itself shows verification status inline.
    if (isClient) {
      navigate('/client/app');
      return;
    }
    navigate(postWelcome === 'app' ? '/app' : '/home');
  }, [isClient, postWelcome, navigate]);

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
              onOpenProject={(id) => navigate(`/app/projects/${id}/submit`)}
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

        {/* --- Client flow --- */}
        <Route
          path="/client/app"
          element={
            <ClientDashboardScreen
              clientName={fullName || 'there'}
              accountStatus={clientAccountStatus}
              walletBalance={clientWalletBalance}
              walletAddress={clientWalletAddress}
              totalFunded={clientWalletBalance}
              onHold={0}
              totalSpent={0}
              activeTab="home"
              onSelectTab={goClientTab}
              onFundWallet={() => navigate('/client/fund-wallet')}
              onAddFunds={() => navigate('/client/fund-wallet')}
              onNotificationsClick={() => navigate('/app/notifications')}
              onProfileClick={() => navigate('/client/profile')}
              onCreateTask={() => navigate('/client/create-task')}
              onMyTasks={() => navigate('/client/tasks')}
              onWallet={() => navigate('/client/wallet')}
              onProjects={() => navigate('/client/projects')}
            />
          }
        />

        <Route
          path="/client/fund-wallet"
          element={
            <FundPlatformWalletScreen
              walletAddress="7xLk3vQeUZ9pM2tRwYbN4KcHjD8sX6uD9K"
              onBack={() => navigate('/client/app')}
              onPaymentSent={(amount) => {
                setClientWalletBalance(amount);
                navigate('/client/verifying');
              }}
            />
          }
        />
        <Route
          path="/client/verifying"
          element={
            <ClientVerificationProgressScreen
              onDone={() => {
                setClientAccountStatus('verified');
                navigate('/client/verified');
              }}
            />
          }
        />
        <Route
          path="/client/verified"
          element={
            <ClientVerificationSuccessScreen
              walletAddress={clientWalletAddress}
              onGoToDashboard={() => navigate('/client/app')}
            />
          }
        />
        <Route
          path="/client/create-task"
          element={
            <CreateTaskScreen
              onBack={() => navigate('/client/app')}
              onNext={(task) => {
                setDraftTask(task);
                navigate('/client/review-task');
              }}
            />
          }
        />
        <Route path="/client/review-task" element={<ClientReviewTaskRoute />} />
        <Route
          path="/client/task-under-review"
          element={<TaskUnderReviewScreen onViewMyTasks={() => navigate('/client/student-assigned')} />}
        />
        <Route
          path="/client/student-assigned"
          element={
            <StudentAssignedScreen
              student={assignedStudent}
              onViewTaskDetails={() => navigate('/client/task-in-progress')}
            />
          }
        />
        <Route
          path="/client/task-in-progress"
          element={
            <TaskInProgressScreen
              student={{ name: assignedStudent.name, role: assignedStudent.role, online: true }}
              progressPercent={80}
              deadline={draftTask ? formatDeadline(draftTask.deadline) : '24 August, 2026'}
              onBack={() => navigate('/client/student-assigned')}
              onGoBackToDashboard={() => navigate('/client/app')}
            />
          }
        />
        <Route
          path="/client/work-submitted"
          element={
            <WorkSubmittedScreen
              studentName={assignedStudent.name.split(' ')[0]}
              submittedOn="20 August, 2026 · 03:45PM"
              files={[{ name: 'Landing_Page_Final.fig', sizeLabel: '1.2 MB' }]}
            />
          }
        />
        <Route
          path="/client/submission-under-review"
          element={
            <SubmissionUnderReviewScreen
              studentName={assignedStudent.name}
              submittedDate="20 August, 2026"
              files={[{ name: 'Landing_Page_Final.fig', sizeLabel: '1.2 MB' }]}
            />
          }
        />
        <Route
          path="/client/work-ready"
          element={
            <WorkReadyForReviewScreen
              studentName={assignedStudent.name}
              submittedDate="20 August, 2026"
              files={[{ name: 'Landing_Page_Final.fig', sizeLabel: '1.2 MB' }]}
              onReviewWork={() => navigate('/client/review-work')}
            />
          }
        />
        <Route path="/client/review-work" element={<ClientReviewWorkRoute />} />
        <Route
          path="/client/work-approved"
          element={
            <WorkApprovedScreen
              amount={draftTask?.budget ?? 10}
              onReleasePayment={() => navigate('/client/payment-released')}
            />
          }
        />
        <Route
          path="/client/payment-released"
          element={
            <PaymentReleasedScreen recipientName={assignedStudent.name} amount={draftTask?.budget ?? 10} />
          }
        />
        <Route
          path="/client/rate-experience"
          element={
            <RateExperienceScreen
              studentName={assignedStudent.name.split(' ')[0]}
              onSubmit={() => navigate('/client/app')}
              onSkip={() => navigate('/client/app')}
            />
          }
        />

        {/* Not built yet */}
        <Route
          path="/client/tasks"
          element={<ClientComingSoon title="Tasks" activeTab="tasks" onTab={goClientTab} />}
        />
        <Route
          path="/client/wallet"
          element={<ClientComingSoon title="Wallet" activeTab="wallet" onTab={goClientTab} />}
        />
        <Route
          path="/client/projects"
          element={<ClientComingSoon title="Projects" activeTab="tasks" onTab={goClientTab} />}
        />
        <Route
          path="/client/profile"
          element={<ClientComingSoon title="Profile" activeTab="profile" onTab={goClientTab} />}
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

  function ClientReviewTaskRoute() {
    if (!draftTask) return <Navigate to="/client/create-task" replace />;
    return (
      <ReviewTaskScreen
        task={draftTask}
        onBack={() => navigate('/client/create-task')}
        onEdit={() => navigate('/client/create-task')}
        onSubmit={() => navigate('/client/task-under-review')}
      />
    );
  }

  function ClientReviewWorkRoute() {
    return (
      <ReviewWorkScreen
        taskTitle={draftTask?.title ?? 'Design a Landing Page for a Fintech Startup'}
        studentName={assignedStudent.name}
        files={[{ name: 'Landing_Page_Final.fig', sizeLabel: '1.2 MB' }]}
        onBack={() => navigate('/client/work-ready')}
        onRequestChanges={() => navigate('/client/app')}
        onApproveWork={() => navigate('/client/work-approved')}
      />
    );
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

function formatDeadline(deadline: string) {
  const date = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Temporary placeholder for client screens that haven't been built yet
// (Tasks list, Wallet, Projects, Profile). Replace each as it's completed.
function ClientComingSoon({
  title,
  activeTab,
  onTab,
}: {
  title: string;
  activeTab: MainTab;
  onTab: (tab: MainTab) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          color: '#6b7280',
          fontSize: 15,
        }}
      >
        {title} — coming soon
      </div>
      <BottomNav active={activeTab} onSelect={onTab} variant="client" />
    </div>
  );
}