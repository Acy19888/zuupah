/**
 * @format
 * Entry point — works for both bare React Native and Expo dev client
 */

import { AppRegistry } from 'react-native';
import App from './src/App';

// For Expo dev client builds the app name must match app.config.js slug
const appName = 'ZuupahApp';

AppRegistry.registerComponent(appName, () => App);
