import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {API_BASE_URL} from '../../Component/API';

interface Task {
  _id: string;
  taskTitle: string;
}

interface TaskListProps {
  navigation: any;
}

const TaskList: React.FC<TaskListProps> = ({navigation}) => {
  const getAllTasksUrl = `${API_BASE_URL}/getAllTasks`;
  const deleteTaskUrl = `${API_BASE_URL}/deleteTask`;
  const logoutUrl = `${API_BASE_URL}/logout`;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>('');

  const getTasks = useCallback(async () => {
    const user = await AsyncStorage.getItem('user_Name');
    setUserName(user);
    try {
      const token = await AsyncStorage.getItem('user_Token');
      const userId = await AsyncStorage.getItem('user_Id');

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(getAllTasksUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      });

      const data = await response.json();
      console.log('Task data', data);
      return data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }, [getAllTasksUrl]); // Add dependencies here

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [getTasks]);

  const deleteTask = async (taskId: string) => {
    try {
      const token = await AsyncStorage.getItem('user_Token');

      if (!token) {
        Alert.alert('User not authenticated');
        return;
      }

      const response = await fetch(`${deleteTaskUrl}/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        Alert.alert(data.message);
      } else {
        Alert.alert(data.message);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      Alert.alert('Failed to delete the task');
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('user_Token');
      if (token) {
        const response = await fetch(logoutUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
          await AsyncStorage.multiRemove([
            'user_Token',
            'user_Name',
            'user_Id',
          ]);
          Alert.alert('Logged Out', 'You have successfully logged out.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Logout failed. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred during logout. Please try again.',
      );
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingOne}>Hi {userName}</Text>
        <Text style={styles.heading}>MyTask</Text>
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
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.designMain}>
                <View style={styles.designInner}>
                  <Image
                    source={require('../../Assets/Images/ToDoLogo.png')}
                    style={styles.logoInner}
                  />
                  <Text style={styles.headingInner}>{item.taskTitle}</Text>
                </View>
                <View style={styles.designInnerTwo}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('TaskDetails', {
                        taskId: item._id,
                        task: item,
                      })
                    }>
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
            ListEmptyComponent={
              <Text style={styles.noTask}>Lets Create Your Task</Text>
            }
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#DC143C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  mainContainer: {flex: 1, padding: 15},
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headingOne: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    width: 100,
    textAlign: 'left',
  },
  headingLogout: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    width: 100,
    textAlign: 'right',
  },
  noTask: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  logo: {width: 45, height: 45, resizeMode: 'contain'},
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
  logoInner: {width: 25, height: 25, resizeMode: 'contain'},
  button: {
    backgroundColor: '#DC143C',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 30,
  },
  buttonText: {color: '#fff', fontSize: 24},
});

export default TaskList;
