/**
 * Theme Store (Zustand)
 * Manages app-wide theme (light/dark/auto) and text size
 */
import { create } from 'zustand';

export type AppTheme = 'light' | 'dark' | 'auto';
export type TextSize = 'small' | 'medium' | 'large';

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

/** Returns resolved colors based on the current theme */
export const getThemeColors = (theme: AppTheme) => {
  const dark = theme === 'dark';
  return {
    background:    dark ? '#1a1f2e' : '#f0f4f8',
    card:          dark ? '#252d3d' : '#ffffff',
    text:          dark ? '#f0f4f8' : '#1a202c',
    textSecondary: dark ? '#94a3b8' : '#718096',
    border:        dark ? '#374151' : '#e2e8f0',
    inputBg:       dark ? '#1e2637' : '#ffffff',
    inputText:     dark ? '#f0f4f8' : '#1a202c',
    headerBg:      dark ? '#1e2637' : '#dbeafe',
    tabBarBg:      dark ? '#1e2637' : '#ffffff',
  };
};

export default useThemeStore;
