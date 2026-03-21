/**
 * Main Tab Navigator — dark/light aware
 */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import StoreScreen from '@screens/store/StoreScreen';
import BookDetailScreen from '@screens/store/BookDetailScreen';
import LibraryScreen from '@screens/library/LibraryScreen';
import PenScreen from '@screens/pen/PenScreen';
import FirmwareUpdateScreen from '@screens/pen/FirmwareUpdateScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import EditProfileScreen from '@screens/profile/EditProfileScreen';
import ChangePasswordScreen from '@screens/profile/ChangePasswordScreen';
import AppearanceScreen from '@screens/profile/AppearanceScreen';
import ParentalControlsScreen from '@screens/profile/ParentalControlsScreen';
import NotificationsScreen from '@screens/profile/NotificationsScreen';
import ZuupahLogo from '@components/ZuupahLogo';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';

const HeaderLogo: React.FC = () => (
  <View style={{ paddingVertical: 4 }}>
    <ZuupahLogo width={100} />
  </View>
);

const Tab = createBottomTabNavigator();
const StoreStack = createStackNavigator();
const LibraryStack = createStackNavigator();
const PenStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const StoreStackNavigator: React.FC = () => (
  <StoreStack.Navigator screenOptions={{ headerShown: false }}>
    <StoreStack.Screen name="StoreList" component={StoreScreen} />
    <StoreStack.Screen name="BookDetail" component={BookDetailScreen} />
  </StoreStack.Navigator>
);

const LibraryStackNavigator: React.FC = () => (
  <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
    <LibraryStack.Screen name="LibraryMain" component={LibraryScreen} />
    <LibraryStack.Screen name="LibraryBookDetail" component={BookDetailScreen} />
  </LibraryStack.Navigator>
);

const PenStackNavigator: React.FC = () => (
  <PenStack.Navigator screenOptions={{ headerShown: false }}>
    <PenStack.Screen name="PenMain" component={PenScreen} />
    <PenStack.Screen name="FirmwareUpdate" component={FirmwareUpdateScreen} />
  </PenStack.Navigator>
);

const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <ProfileStack.Screen name="Appearance" component={AppearanceScreen} />
    <ProfileStack.Screen name="ParentalControls" component={ParentalControlsScreen} />
    <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
  </ProfileStack.Navigator>
);

const MainTabNavigator: React.FC = () => {
  const { tc, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: tc.headerBg },
        headerShadowVisible: false,
        tabBarActiveTintColor: COLORS.beachBlue,
        tabBarInactiveTintColor: tc.textSecondary,
        tabBarStyle: {
          borderTopColor: tc.border,
          backgroundColor: tc.tabBarBg,
        },
        tabBarLabelStyle: { fontFamily: 'Nunito-SemiBold', fontSize: 11 },
      }}
    >
      <Tab.Screen name="Store" component={StoreStackNavigator}
        options={{ tabBarLabel: 'Store',   tabBarIcon: ({ color, size }) => <Icon name="store"     color={color} size={size} /> }} />
      <Tab.Screen name="Library" component={LibraryStackNavigator}
        options={{ tabBarLabel: 'Library', tabBarIcon: ({ color, size }) => <Icon name="library"   color={color} size={size} /> }} />
      <Tab.Screen name="Pen" component={PenStackNavigator}
        options={{ tabBarLabel: 'Pen',     tabBarIcon: ({ color, size }) => <Icon name="bluetooth" color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => <Icon name="account"   color={color} size={size} /> }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
