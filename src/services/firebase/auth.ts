/**
 * Auth Service — In-memory mock for Expo Go testing
 *
 * No native modules, no firebase/auth dependency.
 * Accepts any valid email + password (min 6 chars).
 * Replace this file with real Firebase Auth when building with EAS.
 */
import { User, AuthCredentials, SignUpData, PasswordResetPayload } from '@types/user';

// ── In-memory state ──────────────────────────────────────────────────────────
let _currentUser: User | null = null;
const _listeners: Array<(user: User | null) => void> = [];

const notify = (user: User | null) => _listeners.forEach(fn => fn(user));
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ── Auth actions ─────────────────────────────────────────────────────────────

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
  return user;
};

export const signOut = async (): Promise<void> => {
  await delay(300);
  _currentUser = null;
  notify(null);
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
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateUserProfile,
  sendEmailVerification,
  getCurrentAuthUser,
  isAuthenticated,
  onAuthStateChanged,
};
