import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//import Colors from '../constants/Colors';
import TestScreen from './../screens/TestScreen';
import HomeScreen from './../screens/HomeScreen';
import EditAccountScreen from './../screens/auth/EditAccountScreen';
import { SidebarNavigator } from './SidebarNavigator';

export const MainTabNavigator = createStackNavigator (
    {
      Home: { 
          screen: HomeScreen, 
          navigationOptions: {
            header: null
          },
        },
      
        EditAccount: { 
          screen: EditAccountScreen, 
          navigationOptions: {
            header: null
          }, 
        },
    },
    {
      navigationOptions: () => ({
        header: null
      }),
    }
);