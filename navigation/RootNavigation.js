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
import LoginScreen from './../screens/auth/LoginScreen';
import ForgotPasswordScreen from './../screens/auth/ForgotPasswordScreen';
import SignupScreen from './../screens/auth/SignupScreen';
import EditAccountScreen from './../screens/auth/EditAccountScreen';

import HomeScreen from './../screens/HomeScreen';
import LoadingScreen from './../screens/LoadingScreen';
import RecipeScreen from './../screens/RecipeScreen';
import BudgetScreen from './../screens/BudgetScreen';
import BookmarksScreen from './../screens/BookmarksScreen';
import FoodstockScreen from './../screens/FoodstockScreen';
import MacrosScreen from './../screens/MacrosScreen';
import NavigationService from './NavigationService';

import HomeDrawerNavigator from './MainTabNavigator';

const AppSwitchNavigator = createSwitchNavigator({
    Login: { screen: LoginScreen},
    ForgotPassword: { screen: ForgotPasswordScreen },
    Signup: {screen: SignupScreen },
    Home: { screen: HomeDrawerNavigator },
    EditAccount: {screen: EditAccountScreen},
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default class RootNavigation extends React.Component {
  render(){
      return <AppContainer />
  }
}