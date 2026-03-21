/**
 * Root App Component
 */
import React, { useEffect, useState, useRef } from 'react';
import { Animated, View, Text, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppNavigator from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
import { initializeFirebase } from '@services/firebase/config';
import { COLORS } from '@constants/colors';
import SplashScreen from '@screens/SplashScreen';

// ── Global font default ───────────────────────────────────────────────────────
(Text as any).defaultProps = (Text as any).defaultProps ?? {};
(Text as any).defaultProps.style = { fontFamily: 'Nunito-Regular' };
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum time (ms) the splash is visible so the animation plays fully */
const SPLASH_MIN_MS = 2400;

const App: React.FC = () => {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  const isAuthLoading   = useAuthStore(state => state.isLoading);
  const { theme }       = useThemeStore();
  const deviceScheme    = useColorScheme();

  // Splash control
  const [minTimeUp, setMinTimeUp]   = useState(false);
  const [authDone,  setAuthDone]    = useState(false);
  const fadeOut = useRef(new Animated.Value(1)).current;

  const showSplash = !minTimeUp || !authDone;

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && deviceScheme === 'dark');

  const navTheme = isDark
    ? { ...DarkTheme,    colors: { ...DarkTheme.colors,    background: '#0f1117', card: '#1a1f2e', border: '#334155' } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f0f4f8', card: '#ffffff', border: '#e2e8f0' } };

  const [fontsLoaded] = useFonts({
    'Nunito-Regular':    require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Medium':     require('./assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold':   require('./assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold':       require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold':  require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Black':      require('./assets/fonts/Nunito-Black.ttf'),
    'Nunito-Light':      require('./assets/fonts/Nunito-Light.ttf'),
    'Nunito-ExtraLight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
    'Nunito-Italic':     require('./assets/fonts/Nunito-Italic.ttf'),
    'Nunito-BoldItalic': require('./assets/fonts/Nunito-BoldItalic.ttf'),
  });

  // Start minimum timer immediately
  useEffect(() => {
    const t = setTimeout(() => setMinTimeUp(true), SPLASH_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  // Run auth check; mark done when it resolves
  useEffect(() => {
    initializeFirebase();
    checkAuthStatus().then(() => setAuthDone(true));
  }, [checkAuthStatus]);

  // When both conditions are met, fade the splash out smoothly
  useEffect(() => {
    if (!showSplash) {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash, fadeOut]);

  // Fonts not ready → blank screen (very brief)
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: COLORS.softPillowBlue }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>

      {/* Splash overlaid on top until both conditions pass, then fades out */}
      {(showSplash || (fadeOut as any)._value > 0) && (
        <Animated.View
          pointerEvents={showSplash ? 'auto' : 'none'}
          style={{ position: 'absolute', inset: 0, opacity: fadeOut }}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
};

export default App;
