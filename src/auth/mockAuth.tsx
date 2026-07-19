import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { Auth, AuthUser } from './types';

/**
 * In-memory stand-in auth for environments where the Privy web SDK cannot
 * run (insecure origins such as plain-HTTP LAN dev servers). Accepts any
 * 6-digit code and never talks to the network.
 */

const MockAuthContext = createContext<Auth | null>(null);

export function MockAuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const sendCode = useCallback(async (email: string) => email.length > 0, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    if (code.length !== 6) return null;
    const previewUser: AuthUser = {
      id: 'preview-user',
      email,
      walletAddress: '0x0000…preview',
      isNewUser: true,
    };
    setUser(previewUser);
    return previewUser;
  }, []);

  const logout = useCallback(async () => setUser(null), []);

  const value = useMemo<Auth>(
    () => ({ isReady: true, user, sendCode, verifyCode, logout }),
    [user, sendCode, verifyCode, logout],
  );

  return (
    <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
  );
}

export function useMockAuth(): Auth {
  const auth = useContext(MockAuthContext);
  if (!auth) {
    throw new Error('useMockAuth must be used inside MockAuthProvider');
  }
  return auth;
}
