/**
 * Persisted preferences backed by localStorage: the remembered login email
 * and a registry of emails whose profile setup is complete, so returning
 * users can skip re-typing their email and land straight on the dashboard.
 */

const LAST_EMAIL = 'sb.lastEmail';
const REMEMBER = 'sb.rememberMe';
const COMPLETED = 'sb.completedProfiles';

export type LoginPrefs = {
  email: string;
  rememberMe: boolean;
};

export function loadLoginPrefs(): LoginPrefs {
  try {
    return {
      rememberMe: localStorage.getItem(REMEMBER) !== '0',
      email: localStorage.getItem(LAST_EMAIL) ?? '',
    };
  } catch {
    return { rememberMe: true, email: '' };
  }
}

export function saveLoginPrefs(email: string, rememberMe: boolean): void {
  try {
    localStorage.setItem(REMEMBER, rememberMe ? '1' : '0');
    if (rememberMe && email) {
      localStorage.setItem(LAST_EMAIL, email);
    } else {
      localStorage.removeItem(LAST_EMAIL);
    }
  } catch {
    // Best-effort; ignore storage failures.
  }
}

type CompletedProfile = { name: string };

export function markProfileCompleted(email: string, name: string): void {
  try {
    const raw = localStorage.getItem(COMPLETED);
    const map: Record<string, CompletedProfile> = raw ? JSON.parse(raw) : {};
    map[email.trim().toLowerCase()] = { name };
    localStorage.setItem(COMPLETED, JSON.stringify(map));
  } catch {
    // Best-effort.
  }
}

export function getCompletedProfile(email: string): CompletedProfile | null {
  try {
    const raw = localStorage.getItem(COMPLETED);
    if (!raw) return null;
    const map: Record<string, CompletedProfile> = JSON.parse(raw);
    return map[email.trim().toLowerCase()] ?? null;
  } catch {
    return null;
  }
}
