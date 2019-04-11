import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image} from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

import { NavigationActions, StackActions } from 'react-navigation'
import NavigationService from './NavigationService';

import defAccIcon from './../assets/images/default_acc_icon.png';
import * as firebase from 'firebase';

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            home: true,
            recipes: false,
            budget: false,
            foodstock: false,
            fooddiary: false,
            currentSelected: 'home',
            user: null,
        };
    }

    componentDidMount() {
        this._ismounted = true; // Set boolean to true, then for each setState call have a condition that checks if _ismounted is true

        // Returns a promise of the user's value
        retrieveData = () => {
            ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
            return ref.once("value");
        }

        // Snapshot is the depiction of the user's current data
        retrieveData().then( (snapshot) => {
            if(this._ismounted)
            {
                this.setState( {
                    user: snapshot.val()
                })
            }
        })
    }

    onAccountIconPress = () => {
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 1,
                actions: [NavigationActions.navigate({routeName: 'Home'}),
                          NavigationActions.navigate({routeName: 'EditAccount'})]
            })
        );
    };

    navToTab( parTabNav, tabName)
    {
        const tab = tabName.toLowerCase();
        const prevSelected = this.state.currentSelected;
        if(prevSelected != tab)
        {
            this.setState({[tab]: true, [prevSelected]: false, currentSelected: tab });
        }

        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: parTabNav})]
            })
        );

        this.props.navigation.navigate(tabName);
    }
    render () {
        if(this._ismounted)
        {
            console.log(this.state.user.name);
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.imageContainer } onPress ={this.onAccountIconPress}>
                            <Image source= {defAccIcon} style={{flex:1, width: wPercentage('35%'), height: hPercentage('35%'), resizeMode: 'center'}}/> 
                        </TouchableOpacity>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                    </View>

                    <View >
                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'Home')}
                            style={ (this.state['home']) ? styles.selectedItem : styles.notSelectedItem }>
                            <Text style = { (this.state['home']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'Recipes')}
                            style={ (this.state['recipes']) ? styles.selectedItem : styles.notSelectedItem }>
                            <Text style = { (this.state['recipes']) ? styles.selectedTextStyle : styles.notSelectedTextStyle }>Bookmarks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'Budget')}
                            style={ (this.state['budget']) ? styles.selectedItem : styles.notSelectedItem }>
                            <Text style = { (this.state['budget']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Budget</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'FoodStock')}
                            style={ (this.state['foodstock']) ? styles.selectedItem : styles.notSelectedItem }>
                            <Text style = { (this.state['foodstock']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Foodstock</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'FoodDiary')}
                            style={ (this.state['fooddiary']) ? styles.selectedItem : styles.notSelectedItem }>
                            <Text style = { (this.state['fooddiary']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>FoodDiary</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            )
        }
        return <Text>Not loaded</Text>
        
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(249, 248, 248, 1)',
        paddingTop: 40,
    },
    header: {
        flex: 1,
        justifyContent: 'center', 
        alignItems:'center',
    },

    imageContainer: {
        flex: 1,
        height: hPercentage('25%'),
        borderRadius: 75,
    },

    name: {
        color: 'rgba(175,76,99,1)',
        fontSize: 16
    },

    selectedTextStyle: {
        color: 'rgba(249, 248, 248, 1)',
        fontWeight: 'bold',
        fontSize: 18
    },

    notSelectedTextStyle: {
        color: 'rgba(175,76,99,1)',
        fontWeight: 'bold',
        fontSize: 18
    },

    selectedItem: {
        flex: 1,
        padding: 15,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(175,76,99,1)'
    },

    notSelectedItem: {
        flex: 1,
        padding: 15,
        margin: 5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(249, 248, 248, 1)',
    }
  })