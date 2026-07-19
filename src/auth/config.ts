/**
 * Privy app credentials. The app ID identifies the SkillBridge app; the
 * client ID authorizes this mobile client and comes from the Privy
 * dashboard under App settings -> Clients. Set it via the
 * EXPO_PUBLIC_PRIVY_CLIENT_ID environment variable (e.g. in a local .env).
 */
export const privyConfig = {
  appId: process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? 'cmqy53hyi00mm0clerka9busw',
  clientId:
    process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ??
    'client-WY6aVHNxiVPo1nSnAraZWpPUPdcovfGV7NMx9kdHfYi8Z',
};
