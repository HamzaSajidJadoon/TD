// API.ts

import { Platform } from 'react-native';

// Replace '192.168.100.27' with your local IP address.
export const API_BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001'  // For Android Emulator
  : 'http://192.168.100.27:3001';  // For iOS Simulator
