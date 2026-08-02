import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import PhoneFrame from './components/PhoneFrame';
import type { AccountType, MainTab } from './components/ui';
import { useAuth } from './auth/AuthProvider';
import { isSupabaseConfigured, setSupabaseToken } from './lib/supabase';
import { clientProfiles, profiles, studentProfiles } from './data/repo';
import {
  createTask,
  deliveryToDays,
  fundWallet,
  getClientTaskDetail,
  getClientWallet,
  getTask,
  hasApplied,
  placeBid,
  releasePayment,
  requestChanges,
  requestTask,
  submitClientReview,
  submitWork,
  type ClientTaskDetail,
} from './data/marketplace-service';
import type { Task } from './data/marketplace';
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
import AdminPanel from './admin/AdminPanel';
import LandingPage from './landing/LandingPage';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import StudentHomeScreen from './screens/StudentHomeScreen';
import SubmitWorkScreen from './screens/SubmitWorkScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import VerificationProgressScreen from './screens/VerificationProgressScreen';
import VerificationSuccessScreen from './screens/VerificationSuccessScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import WelcomeToSkillBridgeScreen from './screens/WelcomeToSkillBridgeScreen';

// --- Client flow screens ---
import ClientDashboardScreen, {
  type ClientAccountStatus,
} from './screens/ClientDashboardScreen';
import FundPlatformWalletScreen from './screens/FundPlatformWalletScreen';
import ClientMyTasksScreen from './screens/ClientMyTasksScreen';
import ClientProfileScreen from './screens/ClientProfileScreen';
import ClientVerificationProgressScreen from './screens/ClientVerificationProgressScreen';
import ClientVerificationSuccessScreen from './screens/ClientVerificationSuccessScreen';
import CreateTaskScreen, { type NewTaskDetails } from './screens/CreateTaskScreen';
import ReviewTaskScreen from './screens/ReviewTaskScreen';
import TaskUnderReviewScreen from './screens/TaskUnderReviewScreen';
import ClientTaskDetailScreen from './screens/ClientTaskDetailScreen';
import ReviewWorkScreen from './screens/ReviewWorkScreen';
import WorkApprovedScreen from './screens/WorkApprovedScreen';
import PaymentReleasedScreen from './screens/PaymentReleasedScreen';
import RateExperienceScreen from './screens/RateExperienceScreen';
import HowItWorksScreen from './screens/HowItWorksScreen';
import WhyChooseUsScreen from './screens/WhyChooseUsScreen';

const TAB_PATH: Record<MainTab, string> = {
  home: '/app',
  tasks: '/app/tasks',
  bids: '/app/bids',
  wallet: '/app/wallet', // not used on the student flow
  profile: '/app/profile',
};

const CLIENT_TAB_PATH: Record<MainTab, string> = {
  home: '/client/app',
  tasks: '/client/tasks', // client's "My Tasks" list (create is a button there)
  bids: '/client/app', // not used on the client flow
  wallet: '/client/fund-wallet',
  profile: '/client/profile',
};

export default function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Client-flow specific state ---
  const [clientAccountStatus, setClientAccountStatus] =
    useState<ClientAccountStatus>('unverified');
  const [clientWalletBalance, setClientWalletBalance] = useState(0);
  const [totalFunded, setTotalFunded] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [onHold, setOnHold] = useState(0);
  const [clientWalletAddress] = useState('9x4a6vQeUZ9pM2tRwYbN4KcHjD8sXx3kw1');
  const [draftTask, setDraftTask] = useState<NewTaskDetails | null>(null);
  const [hasTaskNotification, setHasTaskNotification] = useState(false);
  // The project the client is currently reviewing/approving. Populated from real
  // data when they open an admin-approved task, and consumed by the
  // review → approve → release-payment screens.
  const [activeReview, setActiveReview] = useState<{
    projectId: string;
    taskTitle: string;
    studentName: string;
    amount: number;
    files: { name: string; sizeLabel: string }[];
  } | null>(null);

  useEffect(() => {
    const prefs = loadLoginPrefs();
    setRememberedEmail(prefs.email);
    setRememberMe(prefs.rememberMe);
  }, []);

  // Pull the client's real wallet figures (balance / funded / spent / on-hold).
  const refreshClientWallet = useCallback(async () => {
    if (!auth.user || !isSupabaseConfigured) return;
    try {
      const w = await getClientWallet(auth.user.id);
      setClientWalletBalance(w.balance);
      setTotalFunded(w.totalFunded);
      setTotalSpent(w.totalSpent);
      setOnHold(w.onHold);
    } catch {
      // Best-effort; the dashboard still renders with the last-known figures.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.id]);

  // On login: forward the Privy token to Supabase (for row-level security) and
  // ensure this user has a profiles row. No-op until Supabase is configured.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!auth.user) {
        setSupabaseToken(null);
        return;
      }
      const token = await auth.getToken();
      if (!active) return;
      setSupabaseToken(token);
      if (isSupabaseConfigured) {
        try {
          const row = await profiles.upsert({
            id: auth.user.id,
            email: auth.user.email,
            full_name: fullName || undefined,
            wallet_address: auth.user.walletAddress ?? null,
          });
          if (active) setIsAdmin(row.role === 'admin');
          // Restore the saved display name (so returning users and clients see
          // their name instead of a placeholder greeting).
          if (active && !fullName && row.full_name) setFullName(row.full_name);
          // Restore a client's saved verification status so they don't have to
          // re-verify on every login.
          const cp = await clientProfiles.get(auth.user.id);
          if (active && (cp?.verification === 'verified' || cp?.verification === 'pending')) {
            setClientAccountStatus(cp.verification);
          }
          if (active) void refreshClientWallet();
        } catch {
          // Best-effort; screens still render.
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.id]);

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
    (enteredEmail: string, remember: boolean, type: AccountType) => {
      setIntent('login');
      setAccountType(type);
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
        let done = getCompletedProfile(email);
        // Fall back to the database so a returning student on a fresh device (or
        // after clearing storage) isn't sent back through profile setup +
        // verification. A saved student_profiles row means setup is complete.
        if (!done && isSupabaseConfigured && accountType !== 'client') {
          try {
            const [sp, prof] = await Promise.all([
              studentProfiles.get(user.id),
              profiles.get(user.id),
            ]);
            if (sp || prof?.full_name) {
              const name = prof?.full_name || '';
              markProfileCompleted(email, name);
              done = { name };
            }
          } catch {
            // Best-effort; fall back to the local flag.
          }
        }
        setLoginCompleted(done !== null);
        if (done?.name) setFullName(done.name);
      }
      return true;
    },
    [auth, email, intent, accountType],
  );

  const handleVerifiedContinue = useCallback(() => {
    // A client logging in goes straight to the client dashboard.
    if (intent === 'login' && accountType === 'client') {
      setVerified(true);
      navigate('/client/app');
      return;
    }
    if (intent === 'login' && loginCompleted) {
      setVerified(true);
      setPostWelcome('app');
    } else {
      setPostWelcome('home');
    }
    navigate('/welcome');
  }, [intent, accountType, loginCompleted, navigate]);

  const finishWelcome = useCallback(() => {
    // Client accounts see two explainer screens (How It Works, and whatever
    // the designer adds next) before landing on the dashboard.
    if (isClient) {
      navigate('/client/how-it-works');
      return;
    }
    navigate(postWelcome === 'app' ? '/app' : '/home');
  }, [isClient, postWelcome, navigate]);

  const handleProfileComplete = useCallback(
    (completed: StudentProfile) => {
      setProfile(completed);
      if (auth.user && isSupabaseConfigured) {
        const uid = auth.user.id;
        void (async () => {
          try {
            // Submitting profile setup files a verification request. Set it to
            // 'pending' the first time so it shows in the admin queue — but never
            // downgrade a student an admin has already decided on (edits re-save).
            const existing = await studentProfiles.get(uid);
            const keepDecision =
              existing?.verification === 'verified' || existing?.verification === 'rejected';
            await studentProfiles.save({
              user_id: uid,
              avatar_url: completed.avatarUri,
              bio: completed.bio,
              university: completed.university,
              department: completed.department,
              reg_number: completed.regNumber,
              linkedin: completed.linkedin,
              student_id_url: completed.studentIdUri,
              skills: completed.skills,
              portfolio: completed.portfolio,
              available: completed.available,
              ...(keepDecision ? {} : { verification: 'pending' }),
            });
          } catch {
            // Best-effort; the screens still render.
          }
        })();
      }
      navigate(verified ? '/app' : '/verifying');
    },
    [auth.user, verified, navigate],
  );

  const handleLogout = useCallback(() => {
    void auth.logout();
    setProfile(null);
    setVerified(false);
    setFullName('');
    setIsAdmin(false);
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

  // Marketing landing page — full-screen web page, outside the phone frame.
  if (location.pathname === '/') {
    return (
      <LandingPage
        onGetStarted={() => navigate('/onboarding')}
        onLogin={() => navigate('/login')}
      />
    );
  }

  // Admin panel is a full-screen desktop app — rendered outside the phone frame.
  if (location.pathname.startsWith('/admin')) {
    return (
      <AdminPanel
        name={fullName || auth.user?.email?.split('@')[0] || 'Admin'}
        onExit={() => navigate('/app')}
      />
    );
  }

  return (
    <PhoneFrame>
      <Routes>
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
              userId={auth.user?.id}
              avatarUri={profile?.avatarUri}
              onImproveProfile={() => navigate('/profile-setup')}
              onBrowseTasks={() => navigate('/app/browse')}
              onOpenNotifications={() => navigate('/app/notifications')}
              onOpenActivity={(link) => navigate(link)}
              onTab={goTab}
            />
          }
        />
        {/* Tasks tab = the student's own task tracker (All / In Progress / Completed) */}
        <Route
          path="/app/tasks"
          element={
            <MyProjectsScreen
              userId={auth.user?.id}
              onOpenProject={(id) => navigate(`/app/projects/${id}/submit`)}
              onBrowse={() => navigate('/app/browse')}
              onTab={goTab}
            />
          }
        />
        {/* Find Work = the open-task marketplace to bid on */}
        <Route
          path="/app/browse"
          element={
            <BrowseTasksScreen
              onOpenTask={(id) => navigate(`/app/tasks/${id}`)}
              onBack={() => navigate('/app')}
              onTab={goTab}
            />
          }
        />
        <Route
          path="/app/notifications"
          element={
            <NotificationsScreen
              verified={verified}
              userId={auth.user?.id}
              onBack={() => navigate(-1)}
            />
          }
        />
        <Route path="/app/tasks/:taskId" element={<TaskDetailRoute />} />
        <Route path="/app/tasks/:taskId/bid" element={<PlaceBidRoute />} />
        <Route path="/app/bid-accepted/:taskId" element={<BidAcceptedRoute />} />
        <Route
          path="/app/bids"
          element={<MyBidsScreen studentId={auth.user?.id} onTab={goTab} />}
        />
        {/* Legacy path — the task tracker now lives on the Tasks tab. */}
        <Route path="/app/projects" element={<Navigate to="/app/tasks" replace />} />
        <Route path="/app/projects/:projectId/submit" element={<SubmitWorkRoute />} />
        <Route
          path="/app/profile"
          element={
            <ProfileScreen
              {...common}
              profile={profile}
              isAdmin={isAdmin}
              onEditProfile={() => navigate('/profile-setup')}
              onOpenAdmin={() => navigate('/admin')}
              onLogout={handleLogout}
              onTab={goTab}
            />
          }
        />

        {/* --- Client flow --- */}
        <Route
          path="/client/how-it-works"
          element={<HowItWorksScreen onGetStarted={() => navigate('/client/why-choose-us')} />}
        />
        <Route
          path="/client/why-choose-us"
          element={<WhyChooseUsScreen onGetStarted={() => navigate('/client/app')} />}
        />
        <Route
          path="/client/app"
          element={
            <ClientDashboardScreen
              clientId={auth.user?.id}
              clientName={fullName || 'there'}
              accountStatus={clientAccountStatus}
              hasTaskNotification={hasTaskNotification}
              walletBalance={clientWalletBalance}
              walletAddress={clientWalletAddress}
              totalFunded={totalFunded}
              onHold={onHold}
              totalSpent={totalSpent}
              activeTab="home"
              onSelectTab={goClientTab}
              onFundWallet={() => navigate('/client/fund-wallet')}
              onAddFunds={() => navigate('/client/fund-wallet')}
              onNotificationsClick={() => {
                setHasTaskNotification(false);
                navigate('/client/notifications');
              }}
              onOpenActivity={(link) => navigate(link)}
              onProfileClick={() => navigate('/client/profile')}
              onCreateTask={() => {
                setDraftTask(null);
                navigate('/client/create-task');
              }}
              onMyTasks={() => navigate('/client/tasks')}
              onWallet={() => navigate('/client/fund-wallet')}
              onProjects={() => navigate('/client/tasks')}
            />
          }
        />

        <Route
          path="/client/fund-wallet"
          element={
            <FundPlatformWalletScreen
              walletAddress="7xLk3vQeUZ9pM2tRwYbN4KcHjD8sX6uD9K"
              onBack={() => navigate('/client/app')}
              onPaymentSent={async (amount) => {
                if (auth.user) {
                  try {
                    await fundWallet(auth.user.id, amount);
                    await refreshClientWallet();
                  } catch {
                    // Optimistic fallback so the demo still advances.
                    setClientWalletBalance((prev) => prev + amount);
                    setTotalFunded((prev) => prev + amount);
                  }
                }

                if (clientAccountStatus === 'verified') {
                  navigate('/client/app');
                } else {
                  navigate('/client/verifying');
                }
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
                // Persist so the client stays verified across future logins.
                if (auth.user && isSupabaseConfigured) {
                  void clientProfiles
                    .save({ user_id: auth.user.id, verification: 'verified' })
                    .catch(() => {});
                }
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
              initial={draftTask}
              onBack={() => navigate('/client/app')}
              onNext={(task) => {
                setDraftTask(task);
                navigate('/client/review-task');
              }}
            />
          }
        />
        <Route path="/client/review-task" 
          element={<ClientReviewTaskRoute />} 
        />
        <Route
          path="/client/task-under-review"
          element={
            <TaskUnderReviewScreen
              onBack={() => navigate('/client/app')}
              onViewMyTasks={() => navigate('/client/tasks')}
            />
          }
        />

        {/* Adaptive detail: reflects the real project lifecycle for one task. */}
        <Route path="/client/task/:taskId" element={<ClientTaskDetailRoute />} />

        <Route path="/client/review-work" element={<ClientReviewWorkRoute />} />
        <Route
          path="/client/work-approved"
          element={
            <WorkApprovedScreen
              amount={activeReview?.amount ?? 0}
              onBack={() => navigate('/client/tasks')}
              onReleasePayment={async () => {
                if (activeReview) {
                  try {
                    await releasePayment(activeReview.projectId);
                  } catch {
                    // Fall through to the confirmation screen regardless.
                  }
                }
                navigate('/client/payment-released');
              }}
            />
          }
        />
        <Route
          path="/client/payment-released"
          element={
            <PaymentReleasedScreen
              recipientName={activeReview?.studentName ?? 'the student'}
              amount={activeReview?.amount ?? 0}
              onDone={async () => {
                await refreshClientWallet();
                setHasTaskNotification(false);
                navigate('/client/rate-experience');
              }}
            />
          }
        />
        <Route
          path="/client/rate-experience"
          element={
            <RateExperienceScreen
              studentName={(activeReview?.studentName ?? 'the student').split(' ')[0]}
              onSubmit={(rating, review) => {
                if (activeReview) void submitClientReview(activeReview.projectId, rating, review);
                setActiveReview(null);
                navigate('/client/tasks');
              }}
              onSkip={() => {
                setActiveReview(null);
                navigate('/client/tasks');
              }}
            />
          }
        />

        <Route
          path="/client/tasks"
          element={
            <ClientMyTasksScreen
              clientId={auth.user?.id}
              onBack={() => navigate('/client/app')}
              onCreateTask={() => {
                setDraftTask(null);
                navigate('/client/create-task');
              }}
              onOpenTask={(taskId) => navigate(`/client/task/${taskId}`)}
              onTab={goClientTab}
            />
          }
        />

        <Route
          path="/client/notifications"
          element={
            <NotificationsScreen
              verified
              userId={auth.user?.id}
              onBack={() => navigate('/client/app')}
            />
          }
        />
        {/* Legacy paths — redirect to the real screens */}
        <Route path="/client/wallet" element={<Navigate to="/client/fund-wallet" replace />} />
        <Route path="/client/projects" element={<Navigate to="/client/tasks" replace />} />
        <Route
          path="/client/profile"
          element={
            <ClientProfileScreen
              clientId={auth.user?.id}
              name={fullName}
              email={email}
              walletAddress={clientWalletAddress}
              accountStatus={clientAccountStatus}
              walletBalance={clientWalletBalance}
              totalFunded={totalFunded}
              totalSpent={totalSpent}
              onHold={onHold}
              onBack={() => navigate('/client/app')}
              onMyTasks={() => navigate('/client/tasks')}
              onFundWallet={() => navigate('/client/fund-wallet')}
              onLogout={handleLogout}
              onTab={goClientTab}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  );

  function TaskDetailRoute() {
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null | undefined>(undefined);
    const [requesting, setRequesting] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
      let active = true;
      if (!taskId) {
        setTask(null);
        return;
      }
      getTask(taskId)
        .then((t) => active && setTask(t))
        .catch(() => active && setTask(null));
      if (auth.user) {
        hasApplied(taskId, auth.user.id)
          .then((a) => active && setApplied(a))
          .catch(() => {});
      }
      return () => {
        active = false;
      };
    }, [taskId]);

    if (task === undefined) return <LoadingView />;
    if (!task) return <Navigate to="/app/tasks" replace />;

    return (
      <TaskDetailScreen
        task={task}
        studentSkills={profile?.skills}
        requesting={requesting}
        alreadyApplied={applied}
        onBack={() => navigate(-1)}
        onBid={() => navigate(`/app/tasks/${taskId}/bid`)}
        onRequest={async () => {
          if (auth.user && taskId) {
            setRequesting(true);
            const res = await requestTask(taskId, auth.user.id, task.budget);
            setRequesting(false);
            if (!res.ok) {
              setApplied(true);
              return;
            }
          }
          navigate(`/app/bid-accepted/${taskId}`);
        }}
      />
    );
  }

  function PlaceBidRoute() {
    const { taskId } = useParams();
    const [submitting, setSubmitting] = useState(false);
    return (
      <PlaceBidScreen
        onBack={() => navigate(-1)}
        onSubmit={async (bid) => {
          if (auth.user && taskId) {
            setSubmitting(true);
            const res = await placeBid(
              taskId,
              auth.user.id,
              bid.amount,
              deliveryToDays(bid.delivery),
              bid.note,
            );
            setSubmitting(false);
            if (!res.ok) {
              window.alert(
                res.reason === 'already-applied'
                  ? 'You have already applied to this task.'
                  : 'Could not submit your bid. Please try again.',
              );
              return;
            }
          }
          navigate(`/app/bid-accepted/${taskId}`);
        }}
        submitting={submitting}
      />
    );
  }

  function BidAcceptedRoute() {
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null | undefined>(undefined);

    useEffect(() => {
      let active = true;
      if (!taskId) {
        setTask(null);
        return;
      }
      getTask(taskId)
        .then((t) => active && setTask(t))
        .catch(() => active && setTask(null));
      return () => {
        active = false;
      };
    }, [taskId]);

    if (task === undefined) return <LoadingView />;
    if (!task) return <Navigate to="/app/tasks" replace />;

    return (
      <BidAcceptedScreen
        task={task}
        onGoToTask={() => navigate('/app/tasks')}
        onViewProjects={() => navigate('/app/tasks')}
      />
    );
  }

  function SubmitWorkRoute() {
    const { projectId } = useParams();
    const [submitting, setSubmitting] = useState(false);
    return (
      <SubmitWorkScreen
        submitting={submitting}
        onBack={() => navigate(-1)}
        onSubmit={async (files, message) => {
          if (projectId) {
            setSubmitting(true);
            const res = await submitWork(projectId, files, message);
            setSubmitting(false);
            if (!res.ok) {
              window.alert('Could not submit your work. Please try again.');
              return;
            }
          }
          navigate('/app/tasks');
        }}
      />
    );
  }

  function ClientReviewTaskRoute() {
    if (!draftTask) return <Navigate to="/client/create-task" replace />;
    return (
      <ReviewTaskScreen
        task={draftTask}
        onBack={() => navigate('/client/create-task')}
        onEdit={() => navigate('/client/create-task')}
        onSubmit={() => {
          if (auth.user && draftTask) void createTask(auth.user.id, draftTask);
          navigate('/client/task-under-review');
        }}
      />
    );
  }

  // Client opens one of their tasks; the screen reflects the real project state.
  function ClientTaskDetailRoute() {
    const { taskId } = useParams();
    const [detail, setDetail] = useState<ClientTaskDetail | null | undefined>(undefined);

    useEffect(() => {
      let active = true;
      if (!taskId) {
        setDetail(null);
        return;
      }
      getClientTaskDetail(taskId)
        .then((d) => active && setDetail(d))
        .catch(() => active && setDetail(null));
      return () => {
        active = false;
      };
    }, [taskId]);

    if (detail === undefined) return <LoadingView />;
    if (!detail) return <Navigate to="/client/tasks" replace />;

    return (
      <ClientTaskDetailScreen
        detail={detail}
        onBack={() => navigate('/client/tasks')}
        onReview={() => {
          if (detail.project && detail.submission) {
            setActiveReview({
              projectId: detail.project.id,
              taskTitle: detail.title,
              studentName: detail.project.studentName,
              amount: detail.project.amount,
              files: detail.submission.files.map((f) => ({ name: f.name, sizeLabel: f.sizeLabel })),
            });
          }
          navigate('/client/review-work');
        }}
        onTab={goClientTab}
      />
    );
  }

  function ClientReviewWorkRoute() {
    if (!activeReview) return <Navigate to="/client/tasks" replace />;
    return (
      <ReviewWorkScreen
        taskTitle={activeReview.taskTitle}
        studentName={activeReview.studentName}
        files={activeReview.files}
        onBack={() => navigate('/client/tasks')}
        onRequestChanges={(feedback) => {
          if (activeReview) void requestChanges(activeReview.projectId, feedback);
          setActiveReview(null);
          navigate('/client/tasks');
        }}
        onApproveWork={() => navigate('/client/work-approved')}
      />
    );
  }
}

function LoadingView() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#6b7280',
        fontSize: 15,
      }}
    >
      Loading…
    </div>
  );
}