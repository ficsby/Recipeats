import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Text, Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { Font } from 'expo';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
import defAccIcon from './../assets/images/default_acc_icon.png';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

//import Colors from '../constants/Colors';
import EditAccountScreen from './../screens/auth/EditAccountScreen';

import HomeScreen from './../screens/HomeScreen';
import LoadingScreen from './../screens/LoadingScreen';
import RecipeScreen from './../screens/RecipeScreen';
import UserRecipesScreen from './../screens/UserRecipesScreen';
import BudgetScreen from './../screens/BudgetScreen';
import BookmarksScreen from './../screens/BookmarksScreen';
import FoodstockScreen from './../screens/FoodstockScreen';
import MacrosScreen from './../screens/MacrosScreen';
import SearchScreen from './../screens/SearchScreen';
import SearchResults from './../screens/SearchResultScreen';
import SearchHeaderNav from './SearchHeaderNav';
import NavigationService from './NavigationService';
import Sidebar from './SideBar';

/*
Home Page Navigations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
// Bottom tab navigator
const Tabs = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name='home' size={33} color={tintColor} />
            )
        }
    },

    Recipes: {
        screen: UserRecipesScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name='recipe-book' size={32} color={tintColor} />
            )
        }
    },

    Budget: {
        screen: BudgetScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name='budget' size={37} color={tintColor} />
            )
        }
    },
    
    FoodStock: {
        screen: FoodstockScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name='food-stock' size={30} color={tintColor} />
            )
        }
    },

    FoodDiary: {
        screen: MacrosScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name='food-diary' size={35} color={tintColor} />
            )
        }
    },

},{
    tabBarOptions: {
        activeTintColor: 'rgba(249, 248, 248, 1)',
        activeBackgroundColor: 'rgba(175,76,99,1)',
        inactiveTintColor: 'rgba(175,76,99,1)',
        inactiveBackgroundColor: 'rgba(249, 248, 248, 1)',
    },
})

// Stack navigator for home screen, use stack navigator to transition to screens linked from the home screen
const HomeTab = createStackNavigator({
    Home: {
        screen: Tabs,
        navigationOptions: {
            header: null,
        }
    },

    EditAccount: {
        screen: EditAccountScreen,
        navigationOptions: {
            header: null
        }
    },

    SearchScreen: {
        screen: SearchScreen,
        navigationOptions:{
            header:null,
        }
    }, 

    SearchResults: {
        screen: SearchResults,
        navigationOptions:{
            header:null,
        }
    },

    RecipeScreen: {
        screen: RecipeScreen,
        navigationOptions:{
            header:null,
        }
    }

},{
    header: null,
    defaultNavigationOptions:({navigation}) => {
        NavigationService.setTopLevelNavigator(navigation);
    },
})

// Side bar navigation works on all screens other than login, signup and forgot password screen
const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeTab,
    },
},{
    contentComponent: props => <Sidebar {...props} />,
    defaultNavigationOptions:({navigation}) => {
        NavigationService.setTopLevelNavigator(navigation);
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

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f6f6f6',
      paddingTop: 40,
      paddingHorizontal: 20
    },

    uglyDrawerItem: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#E73536',
      padding: 15,
      margin: 5,
      borderRadius: 2,
      borderColor: '#E73536',
      borderWidth: 1,
      textAlign: 'center'
    }
  })