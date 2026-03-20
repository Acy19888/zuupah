module.exports = {
  expo: {
    name: "Zuupah",
    slug: "zuupah-app",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "zuupah",
    userInterfaceStyle: "light",
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
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_CONNECT",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
    },
    plugins: [
      [
        "react-native-ble-plx",
        {
          isBackgroundEnabled: false,
          modes: ["peripheral", "central"],
          bluetoothAlwaysPermission:
            "Allow Zuupah to connect to your Zuupah Pen via Bluetooth.",
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ],
    extra: {
      eas: {
        projectId: "YOUR_EAS_PROJECT_ID",
      },
    },
  },
};
