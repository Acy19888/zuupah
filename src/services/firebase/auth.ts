/**
 * Firebase Authentication Service
 * Handles user authentication, login, registration, and password reset
 */

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getFirebaseAuth, getCurrentUser } from './config';
import { User, AuthCredentials, SignUpData, PasswordResetPayload } from '@types/user';

/**
 * Convert Firebase user to app User type
 */
const firebaseUserToAppUser = (firebaseUser: FirebaseAuthTypes.User): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoUrl: firebaseUser.photoURL || undefined,
    phoneNumber: firebaseUser.phoneNumber || undefined,
    createdAt: firebaseUser.metadata?.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: firebaseUser.metadata?.lastSignedInTime?.toISOString() || new Date().toISOString(),
    isEmailVerified: firebaseUser.emailVerified,
  };
};

/**
 * Sign up a new user with email and password
 * @param data - Sign up data containing email, password, display name
 * @returns Created user object
 */
export const signUp = async (data: SignUpData): Promise<User> => {
  const auth = getFirebaseAuth();

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;

    // Update profile with display name
    await firebaseUser.updateProfile({
      displayName: data.displayName,
    });

    // Send email verification
    await firebaseUser.sendEmailVerification();

    return firebaseUserToAppUser(firebaseUser);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign in user with email and password
 * @param credentials - Email and password
 * @returns Authenticated user object
 */
export const signIn = async (credentials: AuthCredentials): Promise<User> => {
  const auth = getFirebaseAuth();

  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    return firebaseUserToAppUser(userCredential.user);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();

  try {
    await auth.signOut();
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Send password reset email
 * @param email - User email address
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const auth = getFirebaseAuth();

  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Confirm password reset with token and new password
 * @param payload - Reset token and new password
 */
export const confirmPasswordReset = async (payload: PasswordResetPayload): Promise<void> => {
  const auth = getFirebaseAuth();

  try {
    await auth.confirmPasswordReset(payload.token, payload.newPassword);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Get current authenticated user
 * @returns Current user or null
 */
export const getCurrentAuthUser = (): User | null => {
  const firebaseUser = getCurrentUser();
  return firebaseUser ? firebaseUserToAppUser(firebaseUser) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Send email verification to current user
 */
export const sendEmailVerification = async (): Promise<void> => {
  const firebaseUser = getCurrentUser();

  if (!firebaseUser) {
    throw new Error('No user is currently authenticated');
  }

  try {
    await firebaseUser.sendEmailVerification();
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Update user profile information
 * @param updates - Profile updates (displayName, photoURL)
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  const firebaseUser = getCurrentUser();

  if (!firebaseUser) {
    throw new Error('No user is currently authenticated');
  }

  try {
    await firebaseUser.updateProfile(updates);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Update user email address
 * @param newEmail - New email address
 */
export const updateUserEmail = async (newEmail: string): Promise<void> => {
  const firebaseUser = getCurrentUser();

  if (!firebaseUser) {
    throw new Error('No user is currently authenticated');
  }

  try {
    await firebaseUser.updateEmail(newEmail);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Update user password
 * @param newPassword - New password
 */
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  const firebaseUser = getCurrentUser();

  if (!firebaseUser) {
    throw new Error('No user is currently authenticated');
  }

  try {
    await firebaseUser.updatePassword(newPassword);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Handle Firebase authentication errors and convert to user-friendly messages
 */
const handleAuthError = (error: any): Error => {
  const code = error?.code || '';
  let message = 'An authentication error occurred';

  switch (code) {
    case 'auth/user-not-found':
      message = 'User not found. Please check your email.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/email-already-in-use':
      message = 'This email is already registered.';
      break;
    case 'auth/weak-password':
      message = 'Password must be at least 6 characters.';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email address.';
      break;
    case 'auth/operation-not-allowed':
      message = 'This operation is not allowed.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many login attempts. Please try again later.';
      break;
    case 'auth/requires-recent-login':
      message = 'Please sign in again to perform this action.';
      break;
    default:
      message = error?.message || message;
  }

  return new Error(message);
};

export default {
  signUp,
  signIn,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  getCurrentAuthUser,
  isAuthenticated,
  sendEmailVerification,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
};
