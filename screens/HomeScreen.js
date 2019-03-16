import React, { Component } from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
//import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');
const fetch = require('node-fetch');


export default class HomeScreen extends React.Component {
    state = {
        query: '',
        recipes: []
    };

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
    getRecipes = () => {
        currentThis = this;   // Need to keep a reference of the current 'this' because the 'this' context changes in the callback of the promise

        // Returns a promise which then gets the result from the request call
        const fetchPromise = fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=${this.state.query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2"     // API key registered for Spoonacular API
            },
        });

        const fetchResponse = fetchPromise.then(function(response) { return response.json(); })
        // Check if component is mounted before changing state, this check is to prevent memory leaks
        if(this._ismounted)
        {
            fetchResponse.then(function(json){
                currentThis.setState({recipes: json});
            })
        }
    }

    findRecipe = (query) => {
        if( query === '') { return []; }
        const { recipes } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return recipes.filter(recipe => recipe.title.search(regex) >= 0);
    }
    
    async componentDidMount() {
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
    }

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
     }


    onAccountIconPress = () => {
        var navActions = StackActions.reset({
            index: 1,
            actions: [
                // We need to push both the current screen and the next screen that we are transitioning to incase the user wants to go to previous screen
                StackActions.push({ routeName: "Home" }),       
                StackActions.push({ routeName: "EditAccount" }),
            ]
        });

        this.props.navigation.dispatch(navActions);
    };

    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();
        this.getRecipes();

        return (
            <View>
                {/* Top panel of page. Contains the menu and user account buttons. 
                    Does not actually contain the Autocomplete Search Bar, but is visually underneath it  */}
                <View style={styles.topContainer}>
                    <View style={styles.row}>
                        {/* Side bar navigation icon */}
                        <TouchableOpacity onPress = { () => DrawerActions.openDrawer()}>
                            <Icon name='menu' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200} style={{marginLeft: 18}} />
                        </TouchableOpacity>

                        {/* User account icon  */}
                        <TouchableOpacity onPress ={this.onAccountIconPress} >
                            <Icon name='user' size={25} color='rgba(175,76,99,1)' style={{marginLeft: (WIDTH - 85)}} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar, capable of autocomplete */}
                <Autocomplete
                    containerStyle={styles.searchContainer}  
                    inputContainerStyle={styles.searchInputContainer}
                    data={recipes.length === 1 && comp(query, recipes[0].title) ? [] : recipes}
                    defaultValue = { query }
                    autoCorrect={false}
                    placeholder= "Search recipes, ingredients..."
                    onChangeText={text => this.setState({ query: text })}
                    renderItem={({ id, title }) => 
                    (
                        // Search Results List
                        <TouchableOpacity style={styles.searchResultsContainer} onPress={() => this.setState({ query: title })}>
                            <Text style={styles.searchResult}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    )}                       
                />
            </View>

        )
    }
}

const styles = StyleSheet.create({

    /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },

    /*------------------------------------------------------------------------
       Top Section
    ------------------------------------------------------------------------*/
    topContainer: {
        width: '100%',
        height: 80,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: 'rgba(244, 238, 238, 0.5)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },

      
     /*------------------------------------------------------------------------
        Autocomplete Section
    ------------------------------------------------------------------------*/
    
    searchContainer: {
        alignSelf: 'center',
        width: '74%',
        marginTop: 10,
        flex: 1,
        top: 17,
        zIndex: 1,
        position: 'absolute',
    },

    searchInputContainer: {
        alignSelf: 'center',
        width: '94%',
        paddingLeft: 10,
        backgroundColor: 'rgba(255,255,255,1)',
        // marginTop: -5,
    },

    searchInput: {
        width: '100%',
        fontSize: 15,
        paddingLeft: 10,
    },

    searchResultsContainer: {
        width: '100%',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },

    searchResult: {
        width: '100%',
    },

    /*------------------------------------------------------------------------
        Sidebar Navigation Section
    ------------------------------------------------------------------------*/

    /*
    logoText: {
        marginTop: -60,
        marginBottom: 15,
        fontFamily: 'dancing-script',
        fontSize: 45,
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 50,
    },
    */

    /*------------------------------------------------------------------------
        Newsfeed Section
    ------------------------------------------------------------------------*/
    newsfeedContainer: {
        height: '81.2%',
        backgroundColor: 'rgba(215, 215, 215, 0.2)',
    },


    /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(225, 218, 218, 0.7)'},
    },

);