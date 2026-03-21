/**
 * Theme Store (Zustand)
 * Manages app-wide theme (light/dark/auto) and text size
 */
import { create } from 'zustand';

export type AppTheme = 'light' | 'dark' | 'auto';
export type TextSize = 'small' | 'medium' | 'large';

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundAlt: string;
  card: string;
  cardAlt: string;
  surface: string;
  // Text
  text: string;
  textSecondary: string;
  textDisabled: string;
  // Inputs
  inputBg: string;
  inputText: string;
  inputBorder: string;
  // Borders
  border: string;
  divider: string;
  // Navigation
  headerBg: string;
  tabBarBg: string;
  // Misc
  overlay: string;
  skeleton: string;
}

const LIGHT: ThemeColors = {
  background:    '#f0f4f8',
  backgroundAlt: '#e2e8f0',
  card:          '#ffffff',
  cardAlt:       '#f8fafc',
  surface:       '#f8fafc',
  text:          '#1a202c',
  textSecondary: '#718096',
  textDisabled:  '#a0aec0',
  inputBg:       '#ffffff',
  inputText:     '#1a202c',
  inputBorder:   '#e2e8f0',
  border:        '#e2e8f0',
  divider:       '#edf2f7',
  headerBg:      '#dbeafe',
  tabBarBg:      '#ffffff',
  overlay:       'rgba(0,0,0,0.4)',
  skeleton:      '#e2e8f0',
};

const DARK: ThemeColors = {
  background:    '#0f1117',
  backgroundAlt: '#1a1f2e',
  card:          '#1e2637',
  cardAlt:       '#252d3d',
  surface:       '#252d3d',
  text:          '#f1f5f9',
  textSecondary: '#94a3b8',
  textDisabled:  '#475569',
  inputBg:       '#252d3d',
  inputText:     '#f1f5f9',
  inputBorder:   '#334155',
  border:        '#334155',
  divider:       '#1e2637',
  headerBg:      '#1a1f2e',
  tabBarBg:      '#1a1f2e',
  overlay:       'rgba(0,0,0,0.7)',
  skeleton:      '#1e2637',
};

export const getThemeColors = (isDark: boolean): ThemeColors =>
  isDark ? DARK : LIGHT;

interface ThemeStore {
  theme: AppTheme;
  textSize: TextSize;
  setTheme: (theme: AppTheme) => void;
  setTextSize: (size: TextSize) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  textSize: 'medium',
  setTheme: (theme) => set({ theme }),
  setTextSize: (textSize) => set({ textSize }),
}));

export default useThemeStore;
