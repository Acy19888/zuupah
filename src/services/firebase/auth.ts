/**
 * Auth Service — Mock with AsyncStorage persistence
 *
 * Uses @react-native-async-storage/async-storage to persist the session
 * across app restarts. Run `npx expo install @react-native-async-storage/async-storage`
 * if not yet installed.
 *
 * Replace this file with real Firebase Auth when building with EAS.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials, SignUpData, PasswordResetPayload } from '@types/user';

const SESSION_KEY   = '@zuupah_session';
const REMEMBER_KEY  = '@zuupah_remember';

// ── In-memory state ──────────────────────────────────────────────────────────
let _currentUser: User | null = null;
const _listeners: Array<(user: User | null) => void> = [];

const notify = (user: User | null) => _listeners.forEach(fn => fn(user));
const delay  = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ── Session persistence ───────────────────────────────────────────────────────

const saveSession = async (user: User | null) => {
  try {
    if (user) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  } catch (_) { /* ignore storage errors */ }
};

export const restoreSession = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (raw) {
      const user: User = JSON.parse(raw);
      _currentUser = user;
      notify(user);
      return user;
    }
  } catch (_) { /* ignore */ }
  return null;
};

// ── Remember Me ───────────────────────────────────────────────────────────────

export interface RememberedCredentials {
  email: string;
  password: string;
}

export const saveRememberedCredentials = async (email: string, password: string) => {
  try {
    await AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
  } catch (_) {}
};

export const clearRememberedCredentials = async () => {
  try { await AsyncStorage.removeItem(REMEMBER_KEY); } catch (_) {}
};

export const getRememberedCredentials = async (): Promise<RememberedCredentials | null> => {
  try {
    const raw = await AsyncStorage.getItem(REMEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

// ── Auth actions ──────────────────────────────────────────────────────────────

export const signUp = async (data: SignUpData): Promise<User> => {
  await delay(700);
  if (!data.email || !data.password || data.password.length < 6) {
    throw new Error('Please enter a valid email and a password with at least 6 characters.');
  }
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.displayName || data.email.split('@')[0];
  const user: User = {
    uid: `mock-${Date.now()}`,
    email: data.email,
    displayName: fullName,
    firstName: data.firstName,
    lastName: data.lastName,
    childName: data.childName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: false,
  };
  _currentUser = user;
  notify(user);
  await saveSession(user);
  return user;
};

export const signIn = async (credentials: AuthCredentials): Promise<User> => {
  await delay(700);
  if (!credentials.email || !credentials.password) {
    throw new Error('Please enter your email and password.');
  }
  const user: User = {
    uid: `mock-${credentials.email.replace(/[^a-z0-9]/gi, '-')}`,
    email: credentials.email,
    displayName: credentials.email.split('@')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: true,
  };
  _currentUser = user;
  notify(user);
  await saveSession(user);
  return user;
};

export const signInWithGoogle = async (): Promise<User> => {
  await delay(800);
  // Mock Google Sign-In — replace with real expo-auth-session + Google OAuth when ready
  const mockEmail = `google.user.${Date.now()}@gmail.com`;
  const user: User = {
    uid: `google-${Date.now()}`,
    email: mockEmail,
    displayName: 'Google User',
    firstName: 'Google',
    lastName: 'User',
    photoUrl: 'https://lh3.googleusercontent.com/a/default',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: true,
  };
  _currentUser = user;
  notify(user);
  await saveSession(user);
  return user;
};

export const signOut = async (): Promise<void> => {
  await delay(300);
  _currentUser = null;
  notify(null);
  await saveSession(null);
  await clearRememberedCredentials();
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  await delay(600);
  if (!email) throw new Error('Please enter your email address.');
  console.log(`[MockAuth] Password reset sent to ${email}`);
};

export const confirmPasswordReset = async (_payload: PasswordResetPayload): Promise<void> => {
  await delay(600);
  console.log('[MockAuth] Password reset confirmed');
};

export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  childName?: string;
}): Promise<void> => {
  await delay(400);
  if (_currentUser) {
    const fullName = updates.firstName || updates.lastName
      ? [updates.firstName ?? _currentUser.firstName, updates.lastName ?? _currentUser.lastName].filter(Boolean).join(' ')
      : (updates.displayName ?? _currentUser.displayName);
    _currentUser = {
      ..._currentUser,
      displayName: fullName,
      firstName: updates.firstName ?? _currentUser.firstName,
      lastName: updates.lastName ?? _currentUser.lastName,
      childName: updates.childName ?? _currentUser.childName,
      photoUrl: updates.photoURL ?? _currentUser.photoUrl,
      updatedAt: new Date().toISOString(),
    };
    notify(_currentUser);
    await saveSession(_currentUser);
  }
};

export const sendEmailVerification = async (): Promise<void> => {
  await delay(400);
  console.log('[MockAuth] Verification email sent');
};

export const getCurrentAuthUser = (): User | null => _currentUser;

export const isAuthenticated = (): boolean => !!_currentUser;

export const onAuthStateChanged = (listener: (user: User | null) => void): (() => void) => {
  _listeners.push(listener);
  listener(_currentUser); // fire immediately
  return () => {
    const i = _listeners.indexOf(listener);
    if (i !== -1) _listeners.splice(i, 1);
  };
};

export default {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateUserProfile,
  sendEmailVerification,
  getCurrentAuthUser,
  isAuthenticated,
  onAuthStateChanged,
  restoreSession,
  getRememberedCredentials,
  saveRememberedCredentials,
  clearRememberedCredentials,
};
