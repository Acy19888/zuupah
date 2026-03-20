/**
 * Authentication State Store (Zustand)
 * Manages authentication state, user data, and auth operations
 */

import { create } from 'zustand';
import { User, AuthState } from '@types/user';
import * as authService from '@services/firebase/auth';

interface AuthStore extends AuthState {
  // Actions
  signUp: (email: string, password: string, displayName: string, firstName?: string, lastName?: string, childName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: { displayName?: string; photoURL?: string; firstName?: string; lastName?: string; childName?: string }) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastAuthTime: undefined,

  signUp: async (email: string, password: string, displayName: string, firstName?: string, lastName?: string, childName?: string) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.signUp({
        email,
        password,
        displayName,
        firstName,
        lastName,
        childName,
        acceptTerms: true,
        acceptPrivacy: true,
      });

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        lastAuthTime: Date.now(),
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.signIn({
        email,
        password,
      });

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        lastAuthTime: Date.now(),
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });

    try {
      await authService.signOut();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });

    try {
      await authService.sendPasswordResetEmail(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    set({ isLoading: true, error: null });

    try {
      await authService.confirmPasswordReset({
        token,
        newPassword,
      });

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });

    try {
      await authService.updateUserProfile(updates);

      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            ...updates,
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  sendEmailVerification: async () => {
    set({ isLoading: true, error: null });

    try {
      await authService.sendEmailVerification();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });

    try {
      const user = authService.getCurrentAuthUser();

      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
