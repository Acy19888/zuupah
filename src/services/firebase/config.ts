/**
 * Firebase Configuration and Initialization
 */

import { initializeApp, getApp, getApps } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
