// src/screens/TaskListScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, Image, SafeAreaView,Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../Component/API';
const AddTask = ({ navigation }: any) => {
  console.log('ffff',API_BASE_URL)
  const addTaskUrl = `${API_BASE_URL}/addTask`;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');

  const AddTaskToDB = async () => {
    if (!taskTitle || !taskDetail) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      // Retrieve the token and userId from AsyncStorage
      const token = await AsyncStorage.getItem('user_Token');
      const userId = await AsyncStorage.getItem('user_Id');
      console.log('Retrieved token from AsyncStorage:', token);
      // Check if token and userId exist
      if (!token || !userId) {
        Alert.alert('Error', 'User not authenticated');
        navigation.navigate('Login'); // Redirect to login if no token or userId found
        return;
      }
  
      // Make the API call
      const response = await fetch(addTaskUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token with "Bearer" prefix
        },
        body: JSON.stringify({
          taskTitle,
          taskDetail,
          userId, // Send userId to associate the task with the user
        }),
      });
  
      const data = await response.json();
  
      // Check if the response was successful
      if (response.status === 201) {
        Alert.alert('Success', 'Task added successfully');
        setTaskTitle(''); // Reset taskTitle
        setTaskDetail(''); // Reset taskDetail
        navigation.navigate('TaskList'); // Navigate to the Task List screen
      } else {
        Alert.alert('Error', data.message || 'Failed to add task');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(err);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headingOne} onPress={()=>navigation.goBack()} >Back</Text>
      {/* <Image
          source={require('../../Assets/Images/ToDoLogo.png')}
          style={styles.logo}
        />   */}
        <Text style={styles.heading}>AddTask</Text>

        <Image
          source={require('../../Assets/Images/ToDoLogo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.innerMain}>
        <TextInput
            style={styles.input}
            placeholder="Enter Task Title..."
            placeholderTextColor={'#fff'}
            value={taskTitle}
            onChangeText={setTaskTitle}
            multiline={true} // Allows multiple lines of text
            textAlignVertical="top"
          />
          <TextInput
            style={styles.inputTwo}
            placeholder="Enter Task Details..."
            placeholderTextColor={'#fff'}
            value={taskDetail}
            onChangeText={setTaskDetail}
            multiline={true} // Allows multiple lines of text
            textAlignVertical="top"
          />
        </View>

<TouchableOpacity style={styles.button} onPress={AddTaskToDB}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#DC143C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    flexDirection: 'row'
  },
  mainContainer: { flex: 1, padding: 15, alignItems: 'center' },
  task: { padding: 10, borderBottomWidth: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headingOne: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  input: { color: '#fff', borderWidth: 1, borderColor: '#F88379', padding: 10, marginTop: 10, borderRadius: 5, width: '100%', height:60 },
  inputTwo: { color: '#fff', borderWidth: 1, borderColor: '#F88379', padding: 10, marginTop: 10, borderRadius: 5, width: '100%', flex:1 },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',

  },
  headingInner: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', height: 50 },
  innerMain: {
    padding: 10,
    flex: 1,
    width: '100%'
  },
  scrol: {
    flex: 1
  },
  innerMainText: {
    fontSize: 16, color: '#fff'
  },
  button: { backgroundColor: '#DC143C', width: '100%', height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  buttonText: { color: '#fff', fontSize: 18 }

});

export default AddTask;
