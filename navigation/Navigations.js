import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer , DrawerItems } from 'react-navigation';


/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

//import Colors from '../constants/Colors';
import LoginScreen from './../screens/auth/LoginScreen';
import ForgotPasswordScreen from './../screens/auth/ForgotPasswordScreen';
import SignupScreen from './../screens/auth/SignupScreen';
import EditAccountScreen from './../screens/auth/EditAccountScreen';

import HomeScreen from './../screens/HomeScreen';
import RecipeScreen from './../screens/HomeScreen';
import BudgetScreen from './../screens/BudgetScreen';
import BookmarksScreen from './../screens/BookmarksScreen';
import FoodStockScreen from '../screens/FoodstockScreen';
import MacrosScreen from './../screens/MacrosScreen';

export default class AppNavigations extends React.Component {
    render(){
        return <AppContainer />
    }
}

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
        screen: FoodStockScreen,
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
        navigationOptions: {
            header: null
        }
    },
    
    EditAccount: {
        screen: EditAccountScreen,
        navigationOptions: {
            header: null
        }
    }
})

// Side bar navigation works on all screens other than login, signup and forgot password screen
const AppDrawerNavigator = createDrawerNavigator({
    _Home__: {
        screen: HomeStackNavigator
    }
});

/*
End of Home Page Navigations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

const AppSwitchNavigator = createSwitchNavigator({
    Home: { screen: AppDrawerNavigator },
    Login: { screen: LoginScreen},
    ForgotPassword: { screen: ForgotPasswordScreen },
    Signup: {screen: SignupScreen },
});


const AppContainer = createAppContainer(AppSwitchNavigator);