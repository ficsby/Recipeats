import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer , DrawerItems } from 'react-navigation';
import { StackActions, DrawerActions } from 'react-navigation';

import SearchHeaderNav from './SearchHeaderNav';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');
const { width: WIDTH } = Dimensions.get('window');

//import Colors from '../constants/Colors';
import EditAccountScreen from './../screens/auth/EditAccountScreen';

import HomeScreen from './../screens/HomeScreen';
import LoadingScreen from './../screens/LoadingScreen';
import RecipeScreen from './../screens/RecipeScreen';
import BudgetScreen from './../screens/BudgetScreen';
import BookmarksScreen from './../screens/BookmarksScreen';
import FoodstockScreen from './../screens/FoodstockScreen';
import MacrosScreen from './../screens/MacrosScreen';
import NavigationService from './NavigationService';

/*
Home Page Navigations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

// Bottom tab navigator
const HomeTabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: ({}) => (
                <Icon name='home' size={33} color='rgba(175,76,99,1)' />
            )
        }
    },

    Recipes: {
        screen: BookmarksScreen,
        navigationOptions: {
            tabBarIcon: ({}) => (
                <Icon name='recipe-book' size={32} color='rgba(175,76,99,1)' />
            )
        }
    },

    Budget: {
        screen: BudgetScreen,
        navigationOptions: {
            tabBarIcon: ({}) => (
                <Icon name='budget' size={37} color='rgba(175,76,99,1)' />
            )
        }
    },
    
    FoodStock: {
        screen: BudgetScreen,
        navigationOptions: {
            tabBarIcon: ({}) => (
                <Icon name='food-stock' size={30} color='rgba(175,76,99,1)' />
            )
        }
    },

    FoodDiary: {
        screen: MacrosScreen,
        navigationOptions: {
            tabBarIcon: ({}) => (
                <Icon name='food-diary' size={35} color='rgba(175,76,99,1)' />
            )
        }
    },

})

// Stack navigator for home screen, use stack navigator to transition to screens linked from the home screen
const HomeStackNavigator = createStackNavigator({
    HomeTabNavigator: {
        screen: HomeTabNavigator,
    },
    
    Loading: {
        screen: LoadingScreen,
        navigationOptions: {
            header: null
        }
    },
    EditAccount: {
        screen: EditAccountScreen,
        navigationOptions: {
            header: null
        }
    },

    Recipe: {
        screen: RecipeScreen,
    },

    Foodstock: {
        screen: FoodstockScreen,
    },

},{
    defaultNavigationOptions:({navigation}) => {
        NavigationService.setTopLevelNavigator(navigation);

        return{
            header: <SearchHeaderNav/>
        }
    },
})

// Side bar navigation works on all screens other than login, signup and forgot password screen
const AppDrawerNavigator = createDrawerNavigator({
    _Home__: {
        screen: HomeStackNavigator
    },
    _Recipe_: {
        screen: RecipeScreen,
    }
},{
    defaultNavigationOptions:({navigation}) => {
        NavigationService.setTopLevelNavigator(navigation);

        return{
            header: <SearchHeaderNav/>
        }
    },
});

/*
End of Home Page Navigations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
const AppContainer = createAppContainer(AppDrawerNavigator);

export default class MainTabNavigator extends React.Component {
  render(){
      return <AppContainer />
  }
}