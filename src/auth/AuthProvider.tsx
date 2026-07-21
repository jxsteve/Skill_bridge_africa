import {
  PrivyProvider,
  useLoginWithEmail,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { privyConfig } from './config';

export type AuthUser = {
  id: string;
  email: string;
  walletAddress?: string;
};

export type Auth = {
  isReady: boolean;
  user: AuthUser | null;
  sendCode: (email: string, opts?: { disableSignup?: boolean }) => Promise<boolean>;
  verifyCode: (email: string, code: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

// Embedded wallets require a secure context (https or localhost). On plain-HTTP
// origins (e.g. a LAN dev server) fall back to an in-memory preview auth that
// accepts any 6-digit code, so the whole flow can still be demoed.
const isSecureContext =
  typeof window !== 'undefined' && window.isSecureContext === true;

export function AuthProvider({ children }: PropsWithChildren) {
  if (!isSecureContext) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      clientId={privyConfig.clientId}
      config={{
        loginMethods: ['email'],
        embeddedWallets: {
          ethereum: { createOnLogin: 'users-without-wallets' },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export function useAuth(): Auth {
  return isSecureContext ? usePrivyAuth() : useMockAuth();
}

function usePrivyAuth(): Auth {
  const { ready, authenticated, user, logout } = usePrivy();
  const { sendCode: privySendCode, loginWithCode } = useLoginWithEmail();
  const { wallets } = useWallets();

  const walletAddress =
    wallets.find((w) => w.walletClientType === 'privy')?.address ??
    user?.wallet?.address;

  const sendCode = useCallback(
    async (email: string, opts?: { disableSignup?: boolean }) => {
      try {
        await privySendCode({ email, disableSignup: opts?.disableSignup });
        return true;
      } catch {
        return false;
      }
    },
    [privySendCode],
  );

  const verifyCode = useCallback(
    async (email: string, code: string): Promise<AuthUser | null> => {
      try {
        await loginWithCode({ code });
        return { id: user?.id ?? 'web-user', email, walletAddress };
      } catch {
        return null;
      }
    },
    [loginWithCode, user, walletAddress],
  );

  return {
    isReady: ready,
    user:
      authenticated && user
        ? { id: user.id, email: user.email?.address ?? '', walletAddress }
        : null,
    sendCode,
    verifyCode,
    logout: async () => {
      await logout();
    },
  };
}

// ---- Mock (insecure origins) ----

const MockCtx = createContext<Auth | null>(null);

function MockAuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const sendCode = useCallback(async (email: string) => email.length > 0, []);
  const verifyCode = useCallback(async (email: string, code: string) => {
    if (code.length !== 6) return null;
    const u: AuthUser = { id: 'preview-user', email, walletAddress: '0x0000…preview' };
    setUser(u);
    return u;
  }, []);
  const logout = useCallback(async () => setUser(null), []);

  const value = useMemo<Auth>(
    () => ({ isReady: true, user, sendCode, verifyCode, logout }),
    [user, sendCode, verifyCode, logout],
  );
  return <MockCtx.Provider value={value}>{children}</MockCtx.Provider>;
}

function useMockAuth(): Auth {
  const ctx = useContext(MockCtx);
  if (!ctx) throw new Error('useMockAuth outside provider');
  return ctx;
}
