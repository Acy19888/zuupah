/**
 * useAppTheme
 * Central hook for consuming the app theme.
 * Resolves 'auto' → light/dark based on device setting.
 * Returns tc (ThemeColors) ready to spread into styles.
 */
import { useColorScheme } from 'react-native';
import { useThemeStore, getThemeColors, ThemeColors, TextSize } from '@store/themeStore';

export interface AppThemeResult {
  isDark: boolean;
  tc: ThemeColors;
  textSize: TextSize;
}

export const useAppTheme = (): AppThemeResult => {
  const { theme, textSize } = useThemeStore();
  const deviceScheme = useColorScheme(); // 'dark' | 'light' | null

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && deviceScheme === 'dark');

  const tc = getThemeColors(isDark);

  return { isDark, tc, textSize };
};

export default useAppTheme;
