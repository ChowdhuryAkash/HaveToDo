import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Splash from './screens/splash/Splash'
import Signup from './screens/auth/Signup'
import Login from './screens/auth/Login'
import Home from './screens/home/Home';
import CreateTask from './screens/home/CreateTask';
import EditTask from './screens/home/EditTask';
import ViewTask from './screens/home/ViewTask';
import Profile from './screens/home/Profile';

const App = () => {
  return (
    
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
      <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Stack.Screen name="CreateTask" component={CreateTask} options={{headerShown: false}} />
      <Stack.Screen name="EditTask" component={EditTask} options={{headerShown: false}} />
      <Stack.Screen name="ViewTask" component={ViewTask} options={{headerShown: false}} />
      <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />



      </Stack.Navigator>
    </NavigationContainer>

    // <Profile />

    
  )
}

export default App

const styles = StyleSheet.create({

})