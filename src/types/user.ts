/**
 * User Related Type Definitions
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  preferences?: UserPreferences;
}

export interface UserProfile extends User {
  purchasedBooks: string[];
  downloadedBooks: string[];
  pairedPens: string[];
  totalSpent: number;
  accountType: 'free' | 'premium' | 'family';
  familyMembers?: FamilyMember[];
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  marketingEmails: boolean;
  childSafeMode: boolean;
  parentalControls?: ParentalControl;
}

export interface FamilyMember {
  userId: string;
  name: string;
  age: number;
  role: 'child' | 'parent';
  childFriendlyName?: string;
  createdAt: string;
}

export interface ParentalControl {
  maxScreenTime?: number; // minutes per day
  bedtimeStart?: string; // HH:MM
  bedtimeEnd?: string; // HH:MM
  approvedCategories?: string[];
  blockedCategories?: string[];
  requireApprovalForPurchase: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastAuthTime?: number;
}

export interface UserStats {
  totalBooksDownloaded: number;
  totalMinutesLearned: number;
  favoriteCategory: string;
  lastActivityAt: string;
  streakDays: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  points: number;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  deviceId: string;
  loginTime: string;
  lastActivityTime: string;
  ipAddress?: string;
  userAgent?: string;
}
