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
    },
    android: {
      package: "com.zuupah.zuupah",
      adaptiveIcon: {
        backgroundColor: "#38b6c9",
      },
    },
    extra: {
      eas: {
        projectId: "78b04c82-4741-4b17-9ecd-a085efc011b6",
      },
    },
  },
};
