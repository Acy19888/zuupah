/**
 * Button Component
 * Zuupah branded button with multiple variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
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

/**
 * Button Component
 * Renders a branded Zuupah button with multiple style variants
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.surfaceDark;
    switch (variant) {
      case 'primary':
        return COLORS.beachBlue;
      case 'secondary':
        return COLORS.zestyOrange;
      case 'danger':
        return COLORS.error;
      case 'outline':
        return COLORS.white;
      default:
        return COLORS.beachBlue;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return COLORS.beachBlue;
      default:
        return COLORS.white;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'medium':
        return 12;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return TYPOGRAPHY.fontSize.sm;
      case 'medium':
        return TYPOGRAPHY.fontSize.base;
      case 'large':
        return TYPOGRAPHY.fontSize.lg;
      default:
        return TYPOGRAPHY.fontSize.base;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding(),
          width: fullWidth ? '100%' : 'auto',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? COLORS.beachBlue : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size={size === 'small' ? 'small' : 'small'} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {icon && icon}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  text: {
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
  },
});

export default Button;
