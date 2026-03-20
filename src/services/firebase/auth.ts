/**
 * Firebase Auth Service — Firebase JS SDK (Expo Go compatible)
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordReset,
  updateProfile,
  sendEmailVerification as fbSendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth } from './config';
import { User, AuthCredentials, SignUpData, PasswordResetPayload } from '@types/user';

const toAppUser = (u: FirebaseUser): User => ({
  uid: u.uid,
  email: u.email || '',
  displayName: u.displayName || '',
  photoUrl: u.photoURL || undefined,
  createdAt: u.metadata.creationTime || new Date().toISOString(),
  updatedAt: u.metadata.lastSignInTime || new Date().toISOString(),
  isEmailVerified: u.emailVerified,
});

export const signUp = async (data: SignUpData): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
  await updateProfile(cred.user, { displayName: data.displayName });
  await fbSendEmailVerification(cred.user);
  return toAppUser(cred.user);
};

export const signIn = async (credentials: AuthCredentials): Promise<User> => {
  const cred = await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password);
  return toAppUser(cred.user);
};

export const signOut = () => fbSignOut(firebaseAuth);

export const sendPasswordResetEmail = (email: string) =>
  fbSendPasswordReset(firebaseAuth, email);

export const getCurrentAuthUser = (): User | null => {
  const u = firebaseAuth.currentUser;
  return u ? toAppUser(u) : null;
};

export const isAuthenticated = () => !!firebaseAuth.currentUser;

export default { signUp, signIn, signOut, sendPasswordResetEmail, getCurrentAuthUser, isAuthenticated };
