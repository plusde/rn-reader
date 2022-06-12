import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { NativeModules } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";

import Board from './views/board';
import Thread from './views/thread';
import Settings from './views/settings';
import Saved from './views/saved';
import Sidebar from './views/sidebar';

import theme from './assets/style';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: theme[global.theme].headerColor,
    elevation: 1,
    shadowOpacity: 1,
    borderBottomWidth: theme[global.theme].borderBorromWidth,
  },
  headerTitleStyle: {
    color: theme[global.theme].emphasisedTextColor,
  },
}

const navigators = {
  BoardNavigator: () => {
    return (
      <Drawer.Navigator
        initialRouteName="Board"
        screenOptions={screenOptions}
        drawerContent={(props) => <Sidebar {...props}/>}
      >
        <Drawer.Screen name="Board" component={Board} />
      </Drawer.Navigator>
    )
  }
}

const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar backgroundColor="#00000015" style='light'/>
      <Stack.Navigator
        initialRouteName="BoardNavigator"
        screenOptions={screenOptions}
      >
        <Stack.Screen name="BoardNavigator" component={navigators.BoardNavigator} options={{headerShown: false}} />
        <Stack.Screen name="Thread" component={Thread} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Saved" component={Saved} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
