/**
 * Supabase client. Configure via Vite env vars:
 *   VITE_SUPABASE_URL       — your project URL
 *   VITE_SUPABASE_ANON_KEY  — the public anon key (safe to ship)
 *
 * Identity is handled by Privy, not Supabase Auth. To make row-level security
 * work, we forward the Privy access token as the Authorization bearer so
 * Postgres sees the Privy user id in `request.jwt.claims.sub`. Call
 * `setSupabaseToken(token)` whenever the Privy token changes (see AuthProvider).
 * Until a Supabase project is configured, `isSupabaseConfigured` is false and
 * the app falls back to mock data.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Only forward the Privy token once Supabase is configured to verify it (the
// JWT bridge). Until then, forwarding it makes PostgREST reject every request,
// so demo mode leaves this off and the app talks to Supabase as the anon role.
const forwardPrivyJwt = import.meta.env.VITE_SUPABASE_FORWARD_PRIVY_JWT === 'true';

export const isSupabaseConfigured = Boolean(url && anonKey);

let accessToken: string | null = null;

/** Update the Privy access token forwarded to Supabase for RLS. */
export function setSupabaseToken(token: string | null): void {
  accessToken = token;
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // Inject the current Privy token on every request.
        fetch: (input, init = {}) => {
          const headers = new Headers(init.headers);
          if (forwardPrivyJwt && accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
          }
          return fetch(input, { ...init, headers });
        },
      },
    })
  : null;

/** Narrowing helper: throws if called before Supabase is configured. */
export function db(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );
  }
  return supabase;
}
