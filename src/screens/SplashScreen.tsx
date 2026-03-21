/**
 * SplashScreen
 *
 * Shown on app launch while Firebase auth state is being determined.
 * Features the official Zuupah logo with a smooth fade-in + scale animation.
 *
 * Navigation: automatically replaced by AppNavigator once auth resolves.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { COLORS } from '../constants/colors';
import ZuupahLogo from '../components/ZuupahLogo';

const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade-in + scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Tagline fades in after logo settles
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, scaleAnim, taglineAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.softPillowBlue} />

      {/* Decorative background circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ZuupahLogo width={220} />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineAnim }}>
        <Text style={styles.tagline}>Little touches. Big discoveries.</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsContainer, { opacity: taglineAnim }]}>
        <LoadingDots />
      </Animated.View>
    </View>
  );
};

/** Animated three-dot loading indicator in Zuupah brand colors */
const LoadingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
      );

    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 180),
      animate(dot3, 360),
    ]).start();
  }, [dot1, dot2, dot3]);

  const dotColors = [COLORS.beachBlue, COLORS.morningYellow, COLORS.zestyOrange];

  return (
    <View style={styles.dots}>
      {([dot1, dot2, dot3] as Animated.Value[]).map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: dot, backgroundColor: dotColors[i] }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softPillowBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.beachBlue,
    fontFamily: 'Nunito-Medium',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 48,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circleTopLeft: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.beachBlue,
    top: -60,
    left: -60,
  },
  circleBottomRight: {
    width: 160,
    height: 160,
    backgroundColor: COLORS.morningYellow,
    bottom: -40,
    right: -40,
  },
});

export default SplashScreen;
