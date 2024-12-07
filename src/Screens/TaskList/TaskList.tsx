import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../../Component/API';
// Assuming you have a function to fetch tasks from an API

const TaskList = ({ navigation }: any) => {
  const getAllTasksUrl = `${API_BASE_URL}/getAllTasks`;
  const deleteTaskUrl = `${API_BASE_URL}/deleteTask`;
  const logoutUrl = `${API_BASE_URL}/logout`;
  const [tasks, setTasks] = useState<any[]>([]); // State to hold tasks
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading state
  const [userName, setUserName] = useState(''); 

  // Fetch tasks from API when component mounts
  useEffect(() => {
  
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const taskData = await getTasks();
        setTasks(taskData); // Update the state with the fetched tasks
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getTasks = async () => {
    const  user = await AsyncStorage.getItem('user_Name');
    setUserName(user);
    try {
      const token = await AsyncStorage.getItem('user_Token');
      const userId = await AsyncStorage.getItem('user_Id');  // Get the user ID from AsyncStorage
  
      if (!token || !userId) {
        throw new Error('User not authenticated');
      }
  
      // Pass both the token and userId in the Authorization header
      const response = await fetch(getAllTasksUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
          'userId': userId,  // Send userId in the header
        },
      });
  
      const data = await response.json();
      console.log('Task data', data);
      return data.tasks;  // Assuming the API returns an array of tasks
  
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;  // Propagate error to be handled in the calling function
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const token = await AsyncStorage.getItem('user_Token'); // Assuming the token is stored in AsyncStorage
  
      if (!token) {
        Alert.alert('User not authenticated');
        return;
      }
  
      const response = await fetch(`${deleteTaskUrl}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Remove the deleted task from the list immediately
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        Alert.alert(data.message); // Optionally show a success message
      } else {
        Alert.alert(data.message); // Show an error message if something went wrong
      }
    } catch (err) {
      console.error('Error deleting task:', err);
     Alert.alert('Failed to delete the task');
    }
  };
  

const handleLogout = async () => {
  try {
    // Get the user token from AsyncStorage
    const token = await AsyncStorage.getItem('user_Token');
    console.log('userToken', token)
    if (token) {
      // Make the logout API call
      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  // Send token in the headers for authentication
        },
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        // On successful logout, remove token and username from AsyncStorage
        console.log('data...', token)
        await AsyncStorage.removeItem('user_Token');
        await AsyncStorage.removeItem('user_Name');
        await AsyncStorage.removeItem('user_Id');

        // Show logout success message
        Alert.alert('Logged Out', 'You have successfully logged out.');

        // Navigate to Home or Login screen
        navigation.navigate('Login');  // Change this based on your navigation flow
      } else {
        Alert.alert('Error', 'Logout failed. Please try again.');
      }
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred during logout. Please try again.');
    console.error(error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingOne}>Hi {userName}</Text>
        <Text style={styles.heading}>My Tasks</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.headingLogout}>LogOut</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
  data={tasks}
  keyExtractor={(item) => item._id.toString()} // Ensure you're using the correct ID
  renderItem={({ item }) => (
    <View style={styles.designMain}>
      <View style={styles.designInner}>
        <Image
          source={require('../../Assets/Images/ToDoLogo.png')}
          style={styles.logoInner}
        />
        <Text style={styles.headingInner}>{item.taskTitle}</Text>
      </View>
      <View style={styles.designInnerTwo}>
        <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { taskId: item._id, task: item })}>
          <Image
            source={require('../../Assets/Images/edit.png')}
            style={styles.logoInner}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item._id)}>
          <Image
            source={require('../../Assets/Images/delete.png')}
            style={styles.logoInner}
          />
        </TouchableOpacity>
      </View>
    </View>
  )}
  ListEmptyComponent={<Text style={styles.noTask}>Lets Create Your Task</Text>}
/>

        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.buttonText}>+</Text>
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
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  mainContainer: { flex: 1, padding: 15 },
  loadingText: { color: '#fff', textAlign: 'center', fontSize: 18, marginTop: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#fff' ,  textAlign:'center'},
  headingOne: { fontSize: 15, fontWeight: 'bold', color: '#fff' , width:100, textAlign:'left'},
  headingLogout: { fontSize: 15, fontWeight: 'bold', color: '#fff' , width:100, textAlign:'right'},
  noTask:{fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign:'center', marginTop:50},
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  designMain: {
    width: '100%',
    height: 70,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F88379',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  designInner: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  designInnerTwo: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  headingInner: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  logoInner: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#DC143C',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'flex-end',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 24 },
});

export default TaskList;
