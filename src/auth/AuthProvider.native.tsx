import {
  PrivyProvider,
  useEmbeddedEthereumWallet,
  useLoginWithEmail,
  usePrivy,
} from '@privy-io/expo';
import React, { PropsWithChildren, useCallback } from 'react';

import { privyConfig } from './config';
import type { Auth, AuthUser } from './types';

/**
 * Native auth backed by Privy: passwordless email codes, with an embedded
 * Ethereum wallet created for every account on first login.
 */

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <PrivyProvider appId={privyConfig.appId} clientId={privyConfig.clientId}>
      {children}
    </PrivyProvider>
  );
}

export function useAuth(): Auth {
  const { isReady, user, logout } = usePrivy();
  const { sendCode: privySendCode, loginWithCode } = useLoginWithEmail();
  const { wallets, create: createWallet } = useEmbeddedEthereumWallet();

  const walletAddress = wallets?.[0]?.address;

  const sendCode = useCallback(
    async (email: string) => {
      try {
        const result = await privySendCode({ email });
        return result?.success !== false;
      } catch {
        return false;
      }
    },
    [privySendCode],
  );

  const verifyCode = useCallback(
    async (email: string, code: string): Promise<AuthUser | null> => {
      try {
        const loggedIn = await loginWithCode({ code, email });
        if (!loggedIn) return null;

        // The PRD requires every student to get a wallet automatically.
        let address = walletAddress;
        if (!address) {
          try {
            await createWallet({ createAdditional: false });
            address = wallets?.[0]?.address;
          } catch {
            // Wallet may already exist or be provisioning; not fatal for login.
          }
        }

        return {
          id: loggedIn.id,
          email,
          walletAddress: address,
        };
      } catch {
        return null;
      }
    },
    [loginWithCode, createWallet, wallets, walletAddress],
  );

  const doLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  let email = '';
  if (user) {
    const emailAccount = user.linked_accounts.find((a) => a.type === 'email');
    if (emailAccount && 'address' in emailAccount) {
      email = emailAccount.address;
    }
  }

  return {
    isReady,
    user: user ? { id: user.id, email, walletAddress } : null,
    sendCode,
    verifyCode,
    logout: doLogout,
  };
}
