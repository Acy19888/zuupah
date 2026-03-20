/**
 * Firebase Configuration and Initialization
 */

import { initializeApp, getApp, getApps } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// NOTE: With @react-native-firebase, the native config files handle
// initialization automatically (GoogleService-Info.plist on iOS,
// google-services.json on Android). This object is kept for reference
// and used in isFirebaseConfigured() checks.
const firebaseConfig = {
  apiKey: 'AIzaSyD5Y028zKVA6kBKl-SQsFgdRqIKtYGCGSk',
  authDomain: 'zuupah-77bbc.firebaseapp.com',
  projectId: 'zuupah-77bbc',
  storageBucket: 'zuupah-77bbc.firebasestorage.app',
  messagingSenderId: '263118521985',
  appId: '1:263118521985:ios:ff59c06a2ebea0aa902f80',
};

/**
 * Initialize Firebase app if not already initialized
 */
export const initializeFirebase = (): void => {
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }
};

/**
 * Get Firebase Authentication instance
 */
export const getFirebaseAuth = (): FirebaseAuthTypes.Module => {
  return auth();
};

/**
 * Get Firestore Database instance
 */
export const getFirebaseFirestore = (): any => {
  return firestore();
};

/**
 * Get Firebase Storage instance
 */
export const getFirebaseStorage = (): any => {
  return storage();
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

/**
 * Get current Firebase user
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Sign out from Firebase
 */
export const signOutFirebase = async (): Promise<void> => {
  await auth().signOut();
};

export default {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
  isFirebaseConfigured,
  getCurrentUser,
  signOutFirebase,
};
