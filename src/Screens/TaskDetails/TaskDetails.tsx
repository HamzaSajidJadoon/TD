// src/screens/TaskDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// Define types for the route params
interface Task {
  taskTitle: string;
  taskDetail: string;
}

interface RouteParams {
  task: Task;
}

interface EditTaskProps {
  route: {params: RouteParams};
  navigation: {
    goBack: () => void;
  };
}

const EditTask: React.FC<EditTaskProps> = ({route, navigation}) => {
  const {task} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingOne} onPress={() => navigation.goBack()}>
          Back
        </Text>

        <Text style={styles.heading}>Task Details</Text>
        <Image
          source={require('../../Assets/Images/ToDoLogo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.headingInner}>{task?.taskTitle}</Text>
        <View style={styles.innerMain}>
          <ScrollView style={styles.scrol}>
            <Text style={styles.innerMainText}>{task?.taskDetail}</Text>
          </ScrollView>
        </View>
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
    paddingHorizontal: 3,
    flexDirection: 'row',
  },
  mainContainer: {flex: 1, padding: 15, alignItems: 'center'},
  task: {padding: 10, borderBottomWidth: 1},
  headingOne: {fontSize: 15, fontWeight: 'bold', color: '#fff'},
  heading: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  headingTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  headingInner: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    height: 60,
  },
  innerMain: {
    padding: 10,
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F88379',
    borderRadius: 5,
  },
  scrol: {
    flex: 1,
  },
  innerMainText: {
    fontSize: 16,
    color: '#fff',
  },
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
});

export default EditTask;
