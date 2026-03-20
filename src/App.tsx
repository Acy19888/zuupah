/**
 * Root App Component
 * Entry point for the Zuupah application
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { initializeFirebase } from '@services/firebase/config';

/**
 * App Component
 * Root application component with navigation setup
 */
const App: React.FC = () => {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    // Initialize Firebase
    initializeFirebase();

    // Check authentication status on app launch
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
