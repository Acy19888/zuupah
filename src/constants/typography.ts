/**
 * Zuupah Typography System
 * Nunito font family — rounded, friendly, perfect for kids
 */

export const TYPOGRAPHY = {
  // Font Family names (registered in App.tsx via useFonts)
  fontFamily: {
    extraLight: 'Nunito-ExtraLight',
    light:      'Nunito-Light',
    regular:    'Nunito-Regular',
    medium:     'Nunito-Medium',
    semibold:   'Nunito-SemiBold',
    bold:       'Nunito-Bold',
    extraBold:  'Nunito-ExtraBold',
    black:      'Nunito-Black',
    italic:     'Nunito-Italic',
    boldItalic: 'Nunito-BoldItalic',
  },

  // Font Sizes
  fontSize: {
    xs:    12,
    sm:    14,
    base:  16,
    lg:    18,
    xl:    20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },

  // Font Weights (for reference — on Android use fontFamily instead)
  fontWeight: {
    light:     '300' as const,
    normal:    '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
  },

  lineHeight: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.75,
    loose:   2,
  },

  letterSpacing: {
    tight:  -0.5,
    normal:  0,
    wide:    0.5,
    wider:   1,
  },

  // Pre-defined text style combos — use spread in StyleSheet.create
  styles: {
    h1: { fontFamily: 'Nunito-Black',     fontSize: 32, lineHeight: 40 },
    h2: { fontFamily: 'Nunito-ExtraBold', fontSize: 28, lineHeight: 36 },
    h3: { fontFamily: 'Nunito-Bold',      fontSize: 24, lineHeight: 32 },
    h4: { fontFamily: 'Nunito-Bold',      fontSize: 20, lineHeight: 28 },
    body:      { fontFamily: 'Nunito-Regular',  fontSize: 16, lineHeight: 24 },
    bodyMedium:{ fontFamily: 'Nunito-Medium',   fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: 'Nunito-Regular',  fontSize: 14, lineHeight: 20 },
    caption:   { fontFamily: 'Nunito-SemiBold', fontSize: 12, lineHeight: 18 },
    button:    { fontFamily: 'Nunito-Bold',     fontSize: 16, lineHeight: 24 },
    label:     { fontFamily: 'Nunito-SemiBold', fontSize: 14, lineHeight: 20 },
  },
} as const;

// ── nFont helper ──────────────────────────────────────────────────────────────
// Usage in StyleSheet.create:
//   title: { ...nFont('bold'), fontSize: 24, color: COLORS.darkText }
//
// This maps a semantic weight name → the correct Nunito font file,
// so you don't have to remember the exact string.

type NunitoWeight =
  | 'extraLight' | 'light' | 'regular' | 'medium'
  | 'semibold'   | 'bold'  | 'extraBold' | 'black'
  | 'italic'     | 'boldItalic';

export const nFont = (weight: NunitoWeight = 'regular'): { fontFamily: string } => ({
  fontFamily: TYPOGRAPHY.fontFamily[weight],
});
