import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import { MainTabNavigator } from './MainTabNavigator';
import {createAppContainer, createDrawerNavigator, DrawerItems} from "react-navigation";
import EditAccountScreen from "../screens/auth/EditAccountScreen";

const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{flex:1}}>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)

export const SidebarNavigator = createDrawerNavigator({
        Home: MainTabNavigator,
        Settings: EditAccountScreen
    }, {
        contentComponent: CustomDrawerComponent
    }
);