import React, { Component } from 'react';
import {Button} from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import Login from './Login';
import Settings from './Settings';
import MainApp from './MainApp';


enableScreens();
const Stack = createNativeStackNavigator();
function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
        <Stack.Screen name="MainApp" component={MainApp} options={{headerShown: false}}/>
      </Stack.Navigator>
    );
  }

export default class Connection extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    
    render() { 
        return ( 
            <NavigationContainer>
      <MyStack />
    </NavigationContainer>
         );
    }
}
 