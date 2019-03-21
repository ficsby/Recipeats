import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//import Colors from '../constants/Colors';
import TestScreen from './../screens/TestScreen';
import HomeScreen from './../screens/HomeScreen';
import FoodstockScreen from './../screens/FoodstockScreen';
import EditAccountScreen from './../screens/auth/EditAccountScreen';
import RecipeScreen from '../screens/RecipeScreen';

export const MainTabNavigator = createStackNavigator (
    {
      Recipe: { 
        screen: RecipeScreen, 
        navigationOptions: {
          header: null
        },
      },

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
        
        Foodstock: {
          screen: FoodstockScreen,
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