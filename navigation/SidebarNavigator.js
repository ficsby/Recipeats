import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import {createAppContainer, createDrawerNavigator, DrawerItems} from "react-navigation";
import HomeScreen from "../screens/HomeScreen";

const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{flex:1}}>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)

export const CustomDrawer = createAppContainer(
    createDrawerNavigator({
        Home: { screen: MainTabNavigator}
    }, {
        contentComponent: CustomDrawerComponent
    })
);

export default class SidebarNavigator extends React.Component {
    render() {
        return <CustomDrawer/>;
    }
}