import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Dimensions, TextInput, SafeAreaView, ScrollView, Text, Alert } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer , DrawerItems, NavigationActions, StackActions } from 'react-navigation';

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
import SearchScreen from './../screens/SearchScreen';
import NavigationService from './NavigationService';

/*
Home Page Navigations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

// Bottom tab navigator
const Tabs = createBottomTabNavigator({
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

const SearchStack = createStackNavigator({
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            header: null
        }
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

},{
    defaultNavigationOptions:({navigation}) => {
        NavigationService.setTopLevelNavigator(navigation);
    },
})

function navToTab( tabNav, tabName, props)
{
    props.navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: tabNav})]
        })
    );
    // Alert.alert("Button pressed");
    props.navigation.navigate(tabName);
}

const CustomDrawerComponent = (props) => (
    <View style={styles.container}>
        <TouchableOpacity
            onPress={() => navToTab('Home', 'Home', props)}
            style={styles.uglyDrawerItem}>
            <Text>Home</Text>
            
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navToTab('Home', 'Recipes', props)}
            style={styles.uglyDrawerItem}>
            <Text>Bookmarks</Text>
        </TouchableOpacity>
    </View>
)

// Side bar navigation works on all screens other than login, signup and forgot password screen
const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeTab,
        // navigationOptions: {
        //     drawerIcon: ({tintColor}) => (
        //         <Icon name="home" style ={{fontSize: 24, color:tintColor}} />
        //     )
        // }
    },
    Bookmarks:{
        screen: Tabs
    }
},{
    contentComponent: props => <CustomDrawerComponent {...props} />,
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