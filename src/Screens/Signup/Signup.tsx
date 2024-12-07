import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../../Component/API';
const Signup = ({ navigation }) => {
  console.log('ffff',API_BASE_URL)
  const signUpUrl = `${API_BASE_URL}/signup`;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleSignup = async () => {
    try {
      // Send POST request to the signup route
      const response = await fetch(signUpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.toLowerCase().trim(), password }),
      });
  
      // Check if the response is successful
      if (response.ok) {
        const responseData = await response.json();  // Parse the response as JSON
        Alert.alert('Success', responseData.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        // If the response is not successful, parse and display the error message
        const errorResponse = await response.json();  // Assuming the server returns JSON error response
        Alert.alert('Error', errorResponse.message || 'An error occurred during registration.');
      }
    } catch (error) {
      // Handle network or other unexpected errors
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.containerTwo}>
          <Image source={require('../../Assets/Images/ToDoLogo.png')} style={styles.logo} />
          <Text style={styles.heading}>SignUp</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={'#fff'}
              autoCapitalize="none" 
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor={'#fff'}
              value={password}
              autoCapitalize="none" 
              onChangeText={setPassword}
              secureTextEntry
            />
             <TextInput
              style={styles.input}
              placeholder="Enter Confirm Password"
              placeholderTextColor={'#fff'}
              value={confirmPassword}
              autoCapitalize="none" 
              onChangeText={setconfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#000' },
  containerTwo: { flex: 1, alignItems: 'center' },
  heading: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginTop: 50 },
  input: { textTransform: 'lowercase',color: '#fff', borderWidth: 1, borderColor: '#F88379', padding: 10, marginTop: 10, borderRadius: 5, width: '100%', height: 50 },
  inputView: { marginTop: 50, width: '100%', marginBottom: 20 },
  link: { color: '#fff', textAlign: 'center', marginTop: 10, fontSize: 15 },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginTop: 40 },
  button: { backgroundColor: '#DC143C', width: '100%', height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default Signup;
