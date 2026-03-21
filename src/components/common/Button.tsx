/**
 * Button Component — theme aware
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'medium',
  isLoading = false, disabled = false, style, textStyle, icon, fullWidth = false,
}) => {
  const { tc, isDark } = useAppTheme();

  const getBgColor = () => {
    if (disabled) return isDark ? '#374151' : COLORS.surfaceDark;
    switch (variant) {
      case 'primary':  return COLORS.beachBlue;
      case 'secondary': return COLORS.zestyOrange;
      case 'danger':   return COLORS.error;
      case 'outline':  return 'transparent';
      default:         return COLORS.beachBlue;
    }
  };

  const getTextColor = () => {
    if (disabled) return tc.textDisabled;
    switch (variant) {
      case 'outline': return COLORS.beachBlue;
      default:        return COLORS.white;
    }
  };

  const getPadding = () => ({ small: 8, medium: 12, large: 16 }[size] ?? 12);
  const getFontSize = () =>
    ({ small: TYPOGRAPHY.fontSize.sm, medium: TYPOGRAPHY.fontSize.base, large: TYPOGRAPHY.fontSize.lg }[size] ?? TYPOGRAPHY.fontSize.base);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          paddingVertical: getPadding(),
          width: fullWidth ? '100%' : 'auto',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? COLORS.beachBlue : 'transparent',
          opacity: disabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }, textStyle]}>
          {icon && icon}{title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12, paddingHorizontal: 24,
    justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row', minHeight: 44,
  },
  text: { fontFamily: 'Nunito-SemiBold', textAlign: 'center' },
});

export default Button;
