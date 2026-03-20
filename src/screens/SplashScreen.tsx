/**
 * Splash Screen
 * Loading screen shown during app initialization
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

/**
 * SplashScreen Component
 * Animated splash screen with Zuupah branding
 */
const SplashScreen: React.FC = () => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBall} />
          <Text style={styles.appName}>Zuupah</Text>
        </View>
        <Text style={styles.tagline}>Play. Learn. Explore.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beachBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.zestyOrange,
    marginBottom: 16,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    fontWeight: '700' as const,
    color: COLORS.white,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.softPillowBlue,
    fontWeight: '300' as const,
  },
});

export default SplashScreen;
