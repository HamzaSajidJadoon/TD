import React, {useEffect} from 'react';
import AppNavigator from './Navigation/AppNavigator';
import {LogBox, Platform} from 'react-native';
import Orientation from 'react-native-orientation-locker'; // Only import orientation package for mobile platforms

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    console.log('Platform:', Platform.OS); // Log the platform to check which platform is running
    if (Platform.OS! == 'web') {
      console.log('Locking orientation to portrait'); // Lock to portrait only on mobile platforms (Android/iOS)
      Orientation.lockToPortrait();
    } else {
      console.log('Running on web, skipping orientation lock'); // Log for web platforms
    }
  }, []);
  console.log('Rendering AppNavigator'); // Add a log to check if AppNavigator is rendering correctly
  return <AppNavigator />;
};

export default App;
