import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {API_BASE_URL} from '../../Component/API';

// Define props for navigation
type SignupProps = NativeStackScreenProps<any, 'Signup'>;

const Signup: React.FC<SignupProps> = ({navigation}) => {
  console.log('API Base URL:', API_BASE_URL);

  const signUpUrl = `${API_BASE_URL}/signup`;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(signUpUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        Alert.alert('Success', responseData.message, [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
      } else {
        const errorResponse = await response.json();
        Alert.alert(
          'Error',
          errorResponse.message || 'An error occurred during registration.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to connect to the server. Please try again later.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.containerTwo}>
          <Image
            source={require('../../Assets/Images/ToDoLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.heading}>Sign Up</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor="#fff"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#fff"
              autoCapitalize="none"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#fff"
              autoCapitalize="none"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#000'},
  containerTwo: {flex: 1, alignItems: 'center'},
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
  },
  inputView: {marginTop: 50, width: '100%', marginBottom: 20},
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#F88379',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '100%',
    height: 50,
  },
  logo: {width: 150, height: 150, resizeMode: 'contain', marginTop: 40},
  button: {
    backgroundColor: '#DC143C',
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {color: '#fff', fontSize: 18},
  link: {color: '#fff', textAlign: 'center', marginTop: 10, fontSize: 15},
});

export default Signup;
