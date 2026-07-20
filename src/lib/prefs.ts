import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lightweight persisted preferences: the remembered login email and a
 * registry of emails whose profile setup is complete, so returning users
 * can skip re-typing their email and land straight on the dashboard.
 */

const LAST_EMAIL = 'sb.lastEmail';
const REMEMBER = 'sb.rememberMe';
const COMPLETED = 'sb.completedProfiles';

export type LoginPrefs = {
  email: string;
  rememberMe: boolean;
};

export async function loadLoginPrefs(): Promise<LoginPrefs> {
  try {
    const [remember, email] = await Promise.all([
      AsyncStorage.getItem(REMEMBER),
      AsyncStorage.getItem(LAST_EMAIL),
    ]);
    return { rememberMe: remember !== '0', email: email ?? '' };
  } catch {
    return { rememberMe: true, email: '' };
  }
}

export async function saveLoginPrefs(email: string, rememberMe: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(REMEMBER, rememberMe ? '1' : '0');
    if (rememberMe && email) {
      await AsyncStorage.setItem(LAST_EMAIL, email);
    } else {
      await AsyncStorage.removeItem(LAST_EMAIL);
    }
  } catch {
    // Preferences are best-effort; ignore storage failures.
  }
}

type CompletedProfile = { name: string };

export async function markProfileCompleted(email: string, name: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETED);
    const map: Record<string, CompletedProfile> = raw ? JSON.parse(raw) : {};
    map[email.trim().toLowerCase()] = { name };
    await AsyncStorage.setItem(COMPLETED, JSON.stringify(map));
  } catch {
    // Best-effort.
  }
}

export async function getCompletedProfile(
  email: string,
): Promise<CompletedProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETED);
    if (!raw) return null;
    const map: Record<string, CompletedProfile> = JSON.parse(raw);
    return map[email.trim().toLowerCase()] ?? null;
  } catch {
    return null;
  }
}
