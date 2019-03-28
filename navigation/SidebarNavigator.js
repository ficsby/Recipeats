import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import { MainTabNavigator } from './MainTabNavigator';
import {createAppContainer, createDrawerNavigator, DrawerItems} from "react-navigation";

import SearchScreen from './../screens/SearchScreen';
import BookmarksScreen from './../screens/BookmarksScreen';
import MacrosScreen from './../screens/MacrosScreen';
import ExpensesScreen from './../screens/ExpensesScreen';

const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{flex:1}}>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)

export const SidebarNavigator = createDrawerNavigator({
        _Home__: MainTabNavigator,
        _Search_: SearchScreen,
        _Bookmarks__: BookmarksScreen,
        _Macros_: MacrosScreen,
        _Expenses__: ExpensesScreen

    }, {
        contentComponent: CustomDrawerComponent
    }
);