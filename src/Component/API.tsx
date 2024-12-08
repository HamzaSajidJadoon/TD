import {Platform} from 'react-native';

// Server is running on http://localhost:3001.

// NOTE:
// - For Android Emulator, use 'http://10.x.x.x:3001'.
// - For iOS Simulator, use 'http://<YourLocalIP>:3001' for local network testing.
// - For Real Android Devices, use 'http://<YourLocalIP>:3001' (find your machine's IP address).
// - For Real iOS Devices, use 'http://<YourLocalIP>:3001' (find your machine's IP address).
// - For Web, use 'http://localhost:3001' or your host machine's IP (if not using localhost).

// Change them according to your network configuration.
export const API_BASE_URL = Platform.select({
  android: 'http://10.x.x.x:3001', // For Android Emulator
  ios: 'http://192.x.x.x:3001', // For iOS Simulator (Replace <YourLocalIP> with your actual IP)
  web: 'http://localhost:3001', // For Web (Use localhost if on your local machine)
});
