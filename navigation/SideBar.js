import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image} from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

import { NavigationActions, StackActions } from 'react-navigation'
import NavigationService from './NavigationService';

import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
import defAccIcon from './../assets/images/default_acc_icon.png';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            home: true,
            recipes: false,
            budget: false,
            foodstock: false,
			fooddiary: false,
			logout: false,
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
	
	logout()
	{
		const prevSelected = this.state.currentSelected;
		this.setState({['logout']: true, [prevSelected]: false, currentSelected: 'logout' });
		
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		}, function(error) {
			// An error happened.
		});
	}

    render () {
        if(this._ismounted)
        {
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
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['home']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='home' size={20}/>
								<Text style = {(this.state['home']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Home</Text>
							</View>
                        </TouchableOpacity>
						
                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'Recipes')}
                            style={ (this.state['recipes']) ? styles.selectedItem : styles.notSelectedItem }>
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['recipes']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='bookmark' size={25}/>
								<Text style = { (this.state['recipes']) ? styles.selectedTextStyle : styles.notSelectedTextStyle }>Bookmarks</Text>
							</View>

                            
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'Budget')}
                            style={ (this.state['budget']) ? styles.selectedItem : styles.notSelectedItem }>
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['budget']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='budget' size={33}/> 
								<Text style = { (this.state['budget']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Budget</Text>
							</View>
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'FoodStock')}
                            style={ (this.state['foodstock']) ? styles.selectedItem : styles.notSelectedItem }>
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['foodstock']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='food-stock' size={20}/> 
								<Text style = { (this.state['foodstock']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Foodstock</Text>
							</View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.navToTab('Home', 'FoodDiary')}
                            style={ (this.state['fooddiary']) ? styles.selectedItem : styles.notSelectedItem }>
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['fooddiary']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='food-diary' size={25}/> 
								<Text style = { (this.state['fooddiary']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>FoodDiary</Text>
							</View>
                        </TouchableOpacity>

						<TouchableOpacity
                            onPress={() => this.logout()}
                            style={ (this.state['logout']) ? styles.selectedItem : styles.notSelectedItem }>
							<View style={styles.sidebarIconRow}>
								<Icon color={(this.state['logout']) ? 'rgba(249, 248, 248, 1)' : 'rgba(175,76,99,1)'} name='logout' size={25}/> 
								<Text style = { (this.state['logout']) ? styles.selectedTextStyle : styles.notSelectedTextStyle}>Log out</Text>
							</View>
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
		flexDirection:'column',
        color: 'rgba(249, 248, 248, 1)',
		fontWeight: 'bold',
		marginLeft: wPercentage('5%'),
        fontSize: 18
    },

    notSelectedTextStyle: {
		flexDirection:'column',
        color: 'rgba(175,76,99,1)',
		fontWeight: 'bold',
		marginLeft: wPercentage('5%'),
        fontSize: 18
    },

    selectedItem: {
        flex: 1,
        padding: 15,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 18,
		fontWeight: 'bold',
		width: wPercentage('100%'),
        backgroundColor: 'rgba(175,76,99,1)'
    },

    notSelectedItem: {
        flex: 1,
        padding: 15,
        margin: 5,
        fontSize: 18,
		fontWeight: 'bold',
		width: wPercentage('100%'),
        backgroundColor: 'rgba(249, 248, 248, 1)',
	},
	
	sidebarIconRow: {
		flexDirection: "row",
		width: wPercentage("100%"),
	  },
  })