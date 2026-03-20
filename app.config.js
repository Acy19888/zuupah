module.exports = {
  expo: {
    name: "Zuupah",
    slug: "zuupah-app",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "zuupah",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      backgroundColor: "#38b6c9",
    },
    ios: {
      bundleIdentifier: "com.zuupah.app",
      supportsTablet: false,
      infoPlist: {
        NSBluetoothAlwaysUsageDescription:
          "Zuupah needs Bluetooth to connect to your Zuupah Pen.",
        NSBluetoothPeripheralUsageDescription:
          "Zuupah needs Bluetooth to connect to your Zuupah Pen.",
        NSLocationWhenInUseUsageDescription:
          "Zuupah needs location access to scan for Bluetooth devices.",
      },
    },
    android: {
      package: "com.zuupah.app",
      adaptiveIcon: {
        backgroundColor: "#38b6c9",
      },
      permissions: [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.BLUETOOTH_CONNECT",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.INTERNET",
      ],
      googleServicesFile: "./android/app/google-services.json",
    },
    plugins: [
      "expo-dev-client",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ],
    extra: {
      eas: {
        projectId: "78b04c82-4741-4b17-9ecd-a085efc011b6",
      },
    },
  },
};
