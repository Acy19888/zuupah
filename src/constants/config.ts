/**
 * Application Configuration Constants
 */

export const CONFIG = {
  // App Info
  APP_NAME: 'Zuupah',
  APP_VERSION: '0.1.0',
  TAGLINE: 'Play. Learn. Explore.',

  // API & Services
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://api.zuupah.com',
  API_TIMEOUT: 30000,

  // Firebase
  FIREBASE_ENABLED: process.env.REACT_APP_ENABLE_FIREBASE === 'true',
  FIRESTORE_COLLECTIONS: {
    BOOKS: 'books',
    USERS: 'users',
    FIRMWARE: 'firmwareVersions',
    PURCHASES: 'purchases',
  },

  // Bluetooth
  BLE_ENABLED: process.env.REACT_APP_ENABLE_BLE === 'true',
  BLE_SCAN_DURATION: 10000,
  BLE_COMMAND_TIMEOUT: 5000,

  // BLE UUIDs
  BLE_SERVICE_UUID: '12345678-1234-1234-1234-123456789ABC',
  BLE_WRITE_CHARACTERISTIC: '12345678-1234-1234-1234-123456789ABD',
  BLE_NOTIFY_CHARACTERISTIC: '12345678-1234-1234-1234-123456789ABE',

  // File Storage
  MAX_DOWNLOAD_SIZE: 500 * 1024 * 1024, // 500MB
  CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Age Groups
  AGE_GROUPS: [
    { label: '2+', min: 2, max: 3 },
    { label: '3+', min: 3, max: 4 },
    { label: '4+', min: 4, max: 5 },
    { label: '5+', min: 5, max: 6 },
    { label: '6+', min: 6, max: 7 },
    { label: '7+', min: 7, max: 100 },
  ],

  // Book Categories
  BOOK_CATEGORIES: [
    'Animals',
    'Adventure',
    'Learning',
    'Music',
    'Stories',
    'Languages',
    'Science',
    'Daily Life',
  ],

  // Languages
  LANGUAGES: ['English', 'Spanish', 'French', 'German', 'Mandarin'],

  // Analytics
  ANALYTICS_ENABLED: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',

  // Logging
  LOG_LEVEL: (process.env.REACT_APP_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',

  // Timeouts & Delays
  ANIMATION_DURATION: 300,
  SPLASH_SCREEN_DURATION: 2000,

  // Default Values
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_LANGUAGE: 'en-US',

  // Permissions Required (Android)
  ANDROID_PERMISSIONS: [
    'android.permission.BLUETOOTH',
    'android.permission.BLUETOOTH_ADMIN',
    'android.permission.BLUETOOTH_SCAN',
    'android.permission.BLUETOOTH_CONNECT',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.INTERNET',
  ],

  // Permissions Required (iOS)
  IOS_PERMISSIONS: [
    'NSBluetoothPeripheralUsageDescription',
    'NSBluetoothCentralUsageDescription',
  ],
} as const;

export type Config = typeof CONFIG;
