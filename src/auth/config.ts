/**
 * Privy credentials. Both are public client-side identifiers safe to ship in
 * the bundle; override via Vite env vars (VITE_PRIVY_*) when needed.
 */
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID ?? 'cmqy53hyi00mm0clerka9busw',
  clientId:
    import.meta.env.VITE_PRIVY_CLIENT_ID ??
    'client-WY6aVHNxiVPo1nSnAraZWpPUPdcovfGV7NMx9kdHfYi8Z',
};
