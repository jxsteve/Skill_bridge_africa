import {
  PrivyProvider,
  useLoginWithEmail,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import React, { PropsWithChildren, useCallback } from 'react';

import { privyConfig } from './config';
import { MockAuthProvider, useMockAuth } from './mockAuth';
import type { Auth, AuthUser } from './types';

/**
 * Web auth backed by Privy's browser SDK: the same passwordless email
 * codes and auto-created embedded Ethereum wallet as the native app.
 * Privy requires a secure context (https or localhost); on plain-HTTP
 * origins the app falls back to the in-memory preview auth instead.
 */

const isSecureContext =
  typeof window !== 'undefined' && window.isSecureContext === true;

export function AuthProvider({ children }: PropsWithChildren) {
  if (!isSecureContext) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={{
        loginMethods: ['email'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

function usePrivyWebAuth(): Auth {
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
        // The web SDK ties loginWithCode to the email given to sendCode and
        // throws on a wrong code; user state lands in usePrivy afterwards.
        await loginWithCode({ code });
        return {
          id: user?.id ?? 'web-user',
          email,
          walletAddress,
        };
      } catch {
        return null;
      }
    },
    [loginWithCode, user, walletAddress],
  );

  const doLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    isReady: ready,
    user:
      authenticated && user
        ? {
            id: user.id,
            email: user.email?.address ?? '',
            walletAddress,
          }
        : null,
    sendCode,
    verifyCode,
    logout: doLogout,
  };
}

// The secure-context check is constant for the lifetime of the page, so the
// hook choice never changes between renders.
export const useAuth: () => Auth = isSecureContext
  ? usePrivyWebAuth
  : useMockAuth;
