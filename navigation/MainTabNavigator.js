import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, TabBarBottom } from 'react-navigation';
import { createAppContainer } from 'react-navigation';

//import Colors from '../constants/Colors';
import TestScreen from './../screens/TestScreen';

const MainTabNavigator = createAppContainer(
  createBottomTabNavigator(
    {
      Test: {
        screen: TestScreen,
      },
    },
    {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => {
          const { routeName } = navigation.state;
          let iconName;
          switch (routeName) {
            case 'Test':
              iconName =
                Platform.OS === 'ios'
                  ? `ios-information-circle${focused ? '' : '-outline'}`
                  : 'md-information-circle';
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={28}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          );
        },
      }),
      tabBarComponent: TabBarBottom,
      tabBarPosition: 'bottom',
      animationEnabled: false,
      swipeEnabled: false,
    }
  )
);

export default class RootNavigator extends React.Component{
  render() {
    return <MainTabNavigator />;
  }
}