/**
 * Main Tab Navigator
 * Bottom tab navigation for main app screens
 */

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreScreen from '@screens/store/StoreScreen';
import BookDetailScreen from '@screens/store/BookDetailScreen';
import LibraryScreen from '@screens/library/LibraryScreen';
import PenScreen from '@screens/pen/PenScreen';
import FirmwareUpdateScreen from '@screens/pen/FirmwareUpdateScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import ZuupahLogo from '@components/ZuupahLogo';
import { COLORS } from '@constants/colors';

/** Logo component shown in the navigation header center */
const HeaderLogo: React.FC = () => (
  <View style={{ paddingVertical: 4 }}>
    <ZuupahLogo width={100} />
  </View>
);

const Tab = createBottomTabNavigator();
const StoreStack = createNativeStackNavigator();
const PenStack = createNativeStackNavigator();

/**
 * Store Stack Navigator
 */
const StoreStackNavigator: React.FC = () => {
  return (
    <StoreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StoreStack.Screen
        name="StoreList"
        component={StoreScreen}
      />
      <StoreStack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          animationTypeForReplace: 'slide_from_right',
        }}
      />
    </StoreStack.Navigator>
  );
};

/**
 * Pen Stack Navigator
 */
const PenStackNavigator: React.FC = () => {
  return (
    <PenStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PenStack.Screen
        name="PenMain"
        component={PenScreen}
      />
      <PenStack.Screen
        name="FirmwareUpdate"
        component={FirmwareUpdateScreen}
        options={{
          animationTypeForReplace: 'slide_from_right',
        }}
      />
    </PenStack.Navigator>
  );
};

/**
 * MainTabNavigator
 * Manages bottom tab navigation between Store, Library, Pen, and Profile
 */
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: COLORS.softPillowBlue,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: COLORS.beachBlue,
        tabBarInactiveTintColor: COLORS.lightText,
        tabBarStyle: {
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Tab.Screen
        name="Store"
        component={StoreStackNavigator}
        options={{
          tabBarLabel: 'Store',
          tabBarIcon: ({ color, size }) => (
            <Icon name="store" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Icon name="library" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Pen"
        component={PenStackNavigator}
        options={{
          tabBarLabel: 'Pen',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bluetooth" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
