import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../../Component/API';

const Login = ({ navigation }: any) => {
  console.log('ffff',API_BASE_URL)
  const loginUrl = `${API_BASE_URL}/login`;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading state
  const handleLogin = async () => {
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
    //  console.log('Response status:', response.status); // Log response status
      const data = await response.json();
     // console.log('Response data:', data); // Log the response body
  
      if (response.ok) { // Check for successful response status (200-299 range)
        console.log('Login successful, saving data...');
        
        // Ensure data.user is available
        if (data.user && data.user.id && data.user.username) {
          await AsyncStorage.setItem('user_Token', data.token);
          await AsyncStorage.setItem('user_Id', data.user.id);
          await AsyncStorage.setItem('user_Name', data.user.username);
  
          // Navigate to TaskList screen
          navigation.navigate('TaskList');
        } else {
          Alert.alert('Login failed', 'User data is missing.');
        }
      } else {
        Alert.alert('Login failed', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred while logging in');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.containerTwo}>
          <Image source={require('../../Assets/Images/ToDoLogo.png')} style={styles.logo} />
          <Text style={styles.heading}>Login</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={'#fff'}
              value={username}
              autoCapitalize="none" 
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor={'#fff'}
              value={password}
              autoCapitalize='none'
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')}> {/* Corrected link */}
            Don't have an account? SignUp
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor:'#000' },
  containerTwo: { flex: 1, alignItems: 'center' },
  heading: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginTop: 50 },
  input: {textTransform: 'lowercase', color: '#fff', borderWidth: 1, borderColor: '#F88379', padding: 10, marginTop: 10, borderRadius: 5, width: '100%', height: 50 },
  inputView: { marginTop: 50, width: '100%', marginBottom: 20 },
  link: { color: '#fff', textAlign: 'center', marginTop: 10, fontSize: 15 },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginTop: 40 },
  button: { backgroundColor: '#DC143C', width: '100%', height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  buttonText: { color: '#fff', fontSize: 18 }
});

export default Login;