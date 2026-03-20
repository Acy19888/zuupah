/**
 * Firebase Configuration — Firebase JS SDK (Expo Go compatible)
 * Uses inMemoryPersistence to avoid browser localStorage dependency
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD5Y028zKVA6kBKl-SQsFgdRqIKtYGCGSk',
  authDomain: 'zuupah-77bbc.firebaseapp.com',
  projectId: 'zuupah-77bbc',
  storageBucket: 'zuupah-77bbc.firebasestorage.app',
  messagingSenderId: '263118521985',
  appId: '1:263118521985:ios:ff59c06a2ebea0aa902f80',
};

// Initialize app (safe to call multiple times)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize auth — initializeAuth can only be called once, getAuth after that
let _auth: ReturnType<typeof getAuth>;
try {
  _auth = initializeAuth(app, { persistence: inMemoryPersistence });
} catch {
  _auth = getAuth(app);
}

export const firebaseAuth = _auth;
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);

export const getFirebaseAuth = () => firebaseAuth;
export const getFirebaseFirestore = () => firebaseDb;
export const getFirebaseStorage = () => firebaseStorage;
export const getCurrentUser = () => firebaseAuth.currentUser;
export const signOutFirebase = () => firebaseAuth.signOut();
export const isFirebaseConfigured = () => true;
export const initializeFirebase = () => app;

export default { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage, getCurrentUser, signOutFirebase, isFirebaseConfigured, initializeFirebase };
