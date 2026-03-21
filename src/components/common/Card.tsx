/**
 * Card Component — theme aware
 */
import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  borderRadius?: number;
}

export const Card: React.FC<CardProps> = ({
  children, style, onPress,
  variant = 'default', padding = 16, borderRadius = 16,
}) => {
  const { tc } = useAppTheme();

  const variantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 };
      case 'outlined':
        return { borderWidth: 1, borderColor: tc.border };
      default:
        return { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 };
    }
  };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.9 } : {};

  return (
    <Container
      style={[styles.card, { padding, borderRadius, backgroundColor: tc.card, ...variantStyles() }, style]}
      {...containerProps}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({ card: { overflow: 'hidden' } });
export default Card;
