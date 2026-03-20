/**
 * Loading Spinner Component
 * Animated loading indicator with optional text
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional text
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.beachBlue,
  text,
  fullScreen = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
  },
  text: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.darkText,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
