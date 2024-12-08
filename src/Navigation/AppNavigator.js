// src/Navigation/AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Splash from '../Screens/Splash/Splash';
import Signup from '../Screens/Signup/Signup';
import Login from '../Screens/Login/Login';
import AddTask from '../Screens/AddTask/AddTask';
import TaskList from '../Screens/TaskList/TaskList';
import TaskDetails from '../Screens/TaskDetails/TaskDetails';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
