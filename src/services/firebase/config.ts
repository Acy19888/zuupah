/**
 * Firebase Configuration — Firebase JS SDK (Expo Go compatible)
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(app);
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
