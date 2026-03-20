/**
 * Zuupah Brand Color Constants
 * All colors following the official Zuupah brand guidelines
 */

export const COLORS = {
  // Primary Colors
  beachBlue: '#38b6c9',
  zestyOrange: '#ff5a1f',
  morningYellow: '#ffc400',
  softPillowBlue: '#eef6f7',
  white: '#ffffff',

  // Text Colors
  darkText: '#2d3748',
  lightText: '#718096',
  placeholderText: '#cbd5e0',

  // Semantic Colors
  success: '#48bb78',
  error: '#f56565',
  warning: '#ed8936',
  info: '#38b6c9',

  // Background Colors
  background: '#ffffff',
  backgroundAlt: '#f7fafc',
  surfaceLight: '#eef6f7',
  surfaceDark: '#e2e8f0',

  // Border Colors
  border: '#cbd5e0',
  borderLight: '#e2e8f0',

  // Overlay Colors
  overlayDark: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(56, 182, 201, 0.1)',
} as const;

export type ColorName = keyof typeof COLORS;
