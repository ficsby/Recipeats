import { Notifications } from 'expo';
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { SidebarNavigator } from './SidebarNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
//import { EStyleSheet } from 'react-native-extended-stylesheet';

// authentication screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import EditAccountScreen from '../screens/auth/EditAccountScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// screens displayed to a user
import HomeScreen from '../screens/HomeScreen';
import RecipeScreen from '../screens/RecipeScreen';

const RootStackNavigator = createAppContainer(
    createStackNavigator (
    {      
        Recipe: { 
          screen: RecipeScreen, 
          navigationOptions: {
            header: null
          },
        }, 

        // Home: { 
        //   screen: HomeScreen, 
        //   navigationOptions: {
        //     header: null
        //   },
        // },  

        Login: { 
          screen: LoginScreen, 
          navigationOptions: {
            header: null
          },
        },

        ForgotPassword: {
          screen: ForgotPasswordScreen,
          navigationOptions: {
            header: null
          },
        },

        Main: {
          screen: SidebarNavigator,
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
      initialRouteName: "Main",
      navigationOptions: () => ({
        header: null
      }),
    }
    )
);

export default class RootNavigator extends React.Component {
  /*
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  */
  render() {
    return <RootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}