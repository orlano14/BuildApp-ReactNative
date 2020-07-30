import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import {Button, Icon} from 'react-native-elements';
import { View,Text } from 'react-native';
import Home from './Home';
import Settings from './Settings';
import RequestsTypesC from '../Components/RequsetsTypesC';
import Rank from './Rank';





const Tab = createBottomTabNavigator();
function MyStack() {
    return (
      <Tab.Navigator tabBarOptions={{
          activeBackgroundColor:'#666666',
          inactiveBackgroundColor:'#666666',
          activeTintColor:'#fff',
          inactiveTintColor:'#bbb',
          
          }}
          >
        <Tab.Screen name="Home" component={Home} options={{
          tabBarIcon: ({ color, size }) =>(<Icon
            name='ios-home'
            type='ionicon'
            color={color}
            size={size} />)
        }}
        />
        <Tab.Screen name="Rank" component={Rank} options={{
          tabBarIcon: ({ color, size }) =>(<Icon
            name='crown'
            type='material-community'
            color={color}
            size={size} />)
        }}
        />
        <Tab.Screen name="Settings" component={Settings} options={{
          tabBarIcon: ({ color, size }) =>(<Icon
            name='ios-settings'
            type='ionicon'
            color={color}
            size={size} />)
          
        }}
        />
        <Tab.Screen name="Request" component={RequestsTypesC} options={{
          tabBarIcon: ({ color, size }) =>(<Icon
            name='send'
            type='font-awesome'
            color={color}
            size={size} />)
          
        }}
        />
      </Tab.Navigator>
    );
  }

export default class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    
    render() { 
        return ( 
            
      <MyStack />
         );
    }
}
 