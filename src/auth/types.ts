export type AuthUser = {
  id: string;
  email: string;
  walletAddress?: string;
  isNewUser?: boolean;
};

export type Auth = {
  /** False until the auth SDK has finished initializing. */
  isReady: boolean;
  user: AuthUser | null;
  /** Sends a 6-digit one-time code to the address. Resolves false on failure. */
  sendCode: (email: string) => Promise<boolean>;
  /**
   * Confirms the emailed code. On success the user is logged in (creating the
   * account and an embedded wallet on first login) and returned; null otherwise.
   */
  verifyCode: (email: string, code: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};
