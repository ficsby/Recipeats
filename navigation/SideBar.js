import React from 'react'
import { Platform, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, SafeAreaView, Text, Header, Image, Body } from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

import { NavigationActions, StackActions } from 'react-navigation'

import defAccIcon from './../assets/images/default_acc_icon.png';

export default class Sidebar extends React.Component {
    navToTab( tabNav, tabName)
    {
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: tabNav})]
        })
    );

        this.props.navigation.navigate(tabName);
    }
    render () {
        const { navigation } = this.props

        return (
            <ScrollView>
                <View style={{justifyContent: 'center', alignItems:'center'}}>
                    <Image source= {defAccIcon} style={{flex:1, width: wPercentage('30%'), height: hPercentage('30%'), resizeMode: 'center'}}/>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => this.navToTab('Home', 'Home')}
                        style={styles.uglyDrawerItem}>
                        <Text>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.navToTab('Home', 'Recipes')}
                        style={styles.uglyDrawerItem}>
                        <Text>Bookmarks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.navToTab('Home', 'Budget')}
                        style={styles.uglyDrawerItem}>
                        <Text>Budget</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.navToTab('Home', 'FoodStock')}
                        style={styles.uglyDrawerItem}>
                        <Text>Foodstock</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.navToTab('Home', 'FoodDiary')}
                        style={styles.uglyDrawerItem}>
                        <Text>FoodDiary</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
        )
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