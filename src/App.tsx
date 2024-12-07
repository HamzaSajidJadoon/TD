
import React, { useEffect } from 'react';
import AppNavigator from './Navigation/AppNavigator';
import { LogBox, Platform } from 'react-native';
// Only import orientation package for mobile platforms
import Orientation from 'react-native-orientation-locker';

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    // Log the platform to check which platform is running
    console.log('Platform:', Platform.OS);

    // Lock to portrait only on mobile platforms (Android/iOS)
    if (Platform.OS !== 'web') {
      console.log('Locking orientation to portrait');
      Orientation.lockToPortrait();
    } else {
      console.log('Running on web, skipping orientation lock');
    }
  }, []);

  // Add a log to check if AppNavigator is rendering correctly
  console.log('Rendering AppNavigator');

  return <AppNavigator />;
};

export default App;
