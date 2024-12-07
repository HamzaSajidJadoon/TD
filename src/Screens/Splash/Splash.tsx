// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    // Navigate to Task List Screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../Assets/Images/ToDoLogo.png')} 
        style={styles.logo} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logo: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain',
  },
});

export default SplashScreen;
