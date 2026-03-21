/**
 * Root App Component
 * Entry point for the Zuupah application
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppNavigator from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { initializeFirebase } from '@services/firebase/config';
import { COLORS } from '@constants/colors';

// ── Global font override ──────────────────────────────────────────────────────
// Makes ALL <Text> components use Nunito-Regular unless overridden.
// For bold/semibold text, add fontFamily: 'Nunito-Bold' / 'Nunito-SemiBold' etc.
// in the individual StyleSheet definition (see src/constants/typography.ts -> nFont).
(Text as any).defaultProps = (Text as any).defaultProps ?? {};
(Text as any).defaultProps.style = { fontFamily: 'Nunito-Regular' };
// ─────────────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

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

  useEffect(() => {
    initializeFirebase();
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.beachBlue} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
