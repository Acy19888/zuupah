/**
 * Firebase Configuration — Firebase JS SDK (Expo Go compatible)
 * Auth is handled by auth.ts mock — no firebase/auth import here.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
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

// Initialize Firebase app once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);

export const getFirebaseFirestore = () => firebaseDb;
export const getFirebaseStorage = () => firebaseStorage;

// No-op — kept for App.tsx compatibility
export const initializeFirebase = () => app;

export default { getFirebaseFirestore, getFirebaseStorage, initializeFirebase };
