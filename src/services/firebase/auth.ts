/**
 * Auth service — bridges the app to the real Zuupah backend API.
 * Endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/google
 *   GET  /api/auth/me
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { saveToken, clearToken } from '../api/client';

export interface User {
  uid:             string;
  email:           string;
  displayName:     string | null;
  firstName:       string;
  lastName:        string;
  isEmailVerified: boolean;
  createdAt:       string;
  updatedAt:       string;
  authProvider?:   string;
}

type Listener = (user: User | null) => void;

let _currentUser: User | null = null;
const _listeners: Listener[]  = [];
const SESSION_KEY  = '@zuupah_session';
const REMEMBER_KEY = '@zuupah_remember';

function notify(user: User | null) { _listeners.forEach(fn => fn(user)); }

function mapApiUser(raw: any): User {
  return {
    uid:             raw.id,
    email:           raw.email,
    displayName:     raw.displayName ?? `${raw.firstName} ${raw.lastName}`,
    firstName:       raw.firstName,
    lastName:        raw.lastName,
    isEmailVerified: raw.isEmailVerified ?? false,
    authProvider:    raw.authProvider ?? 'email',
    createdAt:       raw.createdAt,
    updatedAt:       raw.updatedAt ?? raw.createdAt,
  };
}

async function saveSession(user: User) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export const getCurrentAuthUser = (): User | null => _currentUser;

export const onAuthStateChange = (fn: Listener): (() => void) => {
  _listeners.push(fn);
  fn(_currentUser);
  return () => { const i = _listeners.indexOf(fn); if (i !== -1) _listeners.splice(i, 1); };
};

export const restoreSession = async (): Promise<User | null> => {
  try {
    const cached = await AsyncStorage.getItem(SESSION_KEY);
    if (cached) { _currentUser = JSON.parse(cached); notify(_currentUser); }
    const res = await apiClient.get<{ user: any }>('/api/auth/me');
    const user = mapApiUser(res.user);
    _currentUser = user;
    await saveSession(user);
    notify(user);
    return user;
  } catch {
    return _currentUser;
  }
};

export const registerUser = async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
  const res = await apiClient.post<{ token: string; user: any }>('/api/auth/register', { email, password, firstName, lastName }, false);
  await saveToken(res.token);
  const user = mapApiUser(res.user);
  _currentUser = user; await saveSession(user); notify(user);
  return user;
};

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const res = await apiClient.post<{ token: string; user: any }>('/api/auth/login', { email, password }, false);
  await saveToken(res.token);
  const user = mapApiUser(res.user);
  _currentUser = user; await saveSession(user); notify(user);
  return user;
};

export const signInWithGoogle = async (): Promise<User> => {
  const mockId = `google-${Date.now()}`;
  const res = await apiClient.post<{ token: string; user: any }>('/api/auth/google',
    { email: `user.${mockId}@gmail.com`, displayName: 'Google User', googleId: mockId }, false);
  await saveToken(res.token);
  const user = mapApiUser(res.user);
  _currentUser = user; await saveSession(user); notify(user);
  return user;
};

export const signOutUser = async (): Promise<void> => {
  _currentUser = null;
  await clearToken();
  await AsyncStorage.removeItem(SESSION_KEY);
  notify(null);
};

export const saveRememberedCredentials = async (email: string, password: string) =>
  AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));

export const clearRememberedCredentials = async () =>
  AsyncStorage.removeItem(REMEMBER_KEY);

export const getRememberedCredentials = async (): Promise<{ email: string; password: string } | null> => {
  const raw = await AsyncStorage.getItem(REMEMBER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const initializeFirebase = () => {};
