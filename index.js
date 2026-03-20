/**
 * @format
 * Entry point — Expo Go compatible
 * registerRootComponent wraps the app correctly for Expo Go and bare RN builds
 */
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
