/**
 * useAuth Hook
 * Provides authentication functionality and state
 */

import { useCallback } from 'react';
import { useAuthStore } from '@store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    sendEmailVerification,
    checkAuthStatus,
    setError,
    clearError,
  } = useAuthStore();

  const handleSignUp = useCallback(
    async (email: string, password: string, displayName: string, firstName?: string, lastName?: string, childName?: string) => {
      try {
        await signUp(email, password, displayName, firstName, lastName, childName);
      } catch (err) {
        console.error('Sign up failed:', err);
      }
    },
    [signUp]
  );

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      try {
        await signIn(email, password);
      } catch (err) {
        console.error('Sign in failed:', err);
      }
    },
    [signIn]
  );

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in failed:', err);
    }
  }, [signInWithGoogle]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  }, [signOut]);

  const handleForgotPassword = useCallback(
    async (email: string) => {
      try {
        await forgotPassword(email);
      } catch (err) {
        console.error('Forgot password failed:', err);
      }
    },
    [forgotPassword]
  );

  const handleResetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        await resetPassword(token, newPassword);
      } catch (err) {
        console.error('Reset password failed:', err);
      }
    },
    [resetPassword]
  );

  const handleUpdateProfile = useCallback(
    async (updates: { displayName?: string; photoURL?: string; firstName?: string; lastName?: string; childName?: string }) => {
      try {
        await updateProfile(updates);
      } catch (err) {
        console.error('Update profile failed:', err);
      }
    },
    [updateProfile]
  );

  const handleSendEmailVerification = useCallback(async () => {
    try {
      await sendEmailVerification();
    } catch (err) {
      console.error('Send email verification failed:', err);
    }
  }, [sendEmailVerification]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    handleSignUp,
    handleSignIn,
    handleGoogleSignIn,
    handleSignOut,
    handleForgotPassword,
    handleResetPassword,
    handleUpdateProfile,
    handleSendEmailVerification,
    checkAuthStatus,
    setError,
    clearError,
  };
};

export default useAuth;
