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
 * Web fallback auth. The Privy SDK is native-only, so the browser preview
 * uses this in-memory stand-in that accepts any 6-digit code. The native
 * build resolves AuthProvider.native.tsx instead, which talks to Privy.
 */

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return auth;
}
