import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//import Colors from '../constants/Colors';
import TestScreen from './../screens/TestScreen';
import HomeScreen from './../screens/HomeScreen';
import FoodstockScreen from './../screens/FoodstockScreen';
import EditAccountScreen from './../screens/auth/EditAccountScreen';

const MainTabNavigator = createAppContainer(
  createStackNavigator (
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
  )
  // // createBottomTabNavigator(
  // //   {
  // //     Home: {
  // //       screen: HomeScreen,
  // //     },
  // //     EditAccount: { 
  // //       screen: EditAccountScreen, 
  // //       navigationOptions: {
  // //         header: null
  // //       }, 
  // //     }, 
  // //   },
  // //   {
  // //     navigationOptions: ({ navigation }) => ({
  // //       tabBarIcon: ({ focused }) => {
  // //         const { routeName } = navigation.state;
  // //         let iconName;
  // //         switch (routeName) {
  // //           case 'Home':
  // //             iconName =
  // //               Platform.OS === 'ios'
  // //                 ? `ios-information-circle${focused ? '' : '-outline'}`
  // //                 : 'md-information-circle';
  // //             break;
  // //           case 'EditAccount':
  // //             iconName =
  // //               Platform.OS === 'ios'
  // //                 ? `ios-information-circle${focused ? '' : '-outline'}`
  // //                 : 'md-information-circle';
  // //             break;
  // //         }
  // //         return (
  // //           <Text>Main page</Text>
  // //         );
  // //       },
  // //     }),
  // //     tabBarComponent: TabBarBottom,
  // //     tabBarPosition: 'bottom',
  // //     animationEnabled: false,
  // //     swipeEnabled: false,
  // //   }
  // )
);

export default class RootNavigator extends React.Component{
  render() {
    return <MainTabNavigator />;
  }
}