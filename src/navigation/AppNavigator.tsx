/**
 * App Navigator
 * Root navigator that switches between Auth and Main stacks
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@store/authStore';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '@screens/SplashScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator
 * Manages navigation between authenticated and unauthenticated states
 */
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
