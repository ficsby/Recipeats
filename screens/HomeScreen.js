import React, { Component } from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
//import * as firebase from 'firebase';

//import logo from './../../assets/images/logo_transparent.png';
//import { reset } from 'expo/build/AR';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');
//var unirest = require('unirest');
const fetch = require('node-fetch');
// fetch.header("X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
// fetch.headers("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=chicken")
// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=chicken")
//         .header("X-RapidAPI-Key", "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
//         .end(function (result) {
//         console.log(result.body[0].title);
// });


export default class HomeScreen extends React.Component {
    state = {
        search: '',
        query: '',
        recipes: [],
        recipeTitle: '',
        recipeId: '',
    };
    
    updateSearch = search => {
        this.setState({ search });
    };

    getRecipes = () => {
        a = this;
        const fetchPromise = fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=${this.state.query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2"
            },
        });

        const fetchResponse = fetchPromise.then(function(response) { return response.json(); })
        const fetchJson = fetchResponse.then(function(json){
            //console.log(json);
            a.setState({recipes: json});
        })
    }

    findRecipe = (query) => {
        if( query === '') { return ''; }
        const { recipes } = this.state;
        query = query.trim()
        const regex = new RegExp(`${query}`, 'i');
        return recipes.filter(recipe => recipe.title.search(regex) >= 0);
    }
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        //this.getRecipes();
        //console.log(this.recipes);
        this.setState({fontLoaded: true});
    }

    onAccountIconPress = () => {
        var navActions = StackActions.reset({
            index: 1,
            actions: [
                StackActions.push({ routeName: "Home" }),
                StackActions.push({ routeName: "EditAccount" }),
            ]
        });

        this.props.navigation.dispatch(navActions);
    };

    render() {

        const { search } = this.state;
        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();
        this.getRecipes();
        return (
            <View>

                <View style={styles.topContainer}>

                    <View style={styles.row}>
                        {/* Side bar navigation icon */}
                        <TouchableOpacity style={{height: 80}} onPress = { () => DrawerActions.openDrawer()}>
                            <Icon name='menu' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '20%'}} />
                        </TouchableOpacity>

                        {/* User account icon */}
                        <TouchableOpacity style={{height: 80}} onPress ={this.onAccountIconPress}>
                            <Icon name='user' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '75%'}} />
                        </TouchableOpacity>
                    </View>

                    {/* <SearchBar placeholder="Search recipes, ingredients..."
                               lightTheme={true}
                               round={true}
                               containerStyle={styles.searchContainer}
                               inputContainerStyle={styles.searchInputContainer}
                               inputStyle={styles.searchInput}
                               onChangeText={this.updateSearch}
                               value={search}
                    /> */}
                    <Autocomplete
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.searchInputContainer}
                        data={recipes.length === 1 && comp(query, recipes[0].title) ? [] : recipes}
                        defaultValue = { query }
                        autoCorrect={false}
                        placeholder= "Search recipes, ingredients..."
                        onChangeText={text => this.setState({ query: text })}
                        renderItem={({ id, title }) => (
                            <TouchableOpacity onPress={() => this.setState(
                                { query: title,
                                  recipeId: id,
                                  recipeTitle: title,
                                })}>
                              <Text style={styles.itemText}>
                                {title}
                              </Text>
                            </TouchableOpacity>
                          )}
                    /> 

                    {/* <View style={styles.descriptionContainer}>
                        {this.state.recipes.length > 0 ? (
                            this.findRecipe(this.state.recipes[0])
                        ) : (
                            <Text style={styles.infoText}>
                            Enter a recipe
                            </Text>
                        )}
                    </View> */}
                    
                </View>
                
                <View style={styles.newsfeedContainer}> 

                </View>

                <View style={styles.row}> 
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name='home' size={33} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '16%', paddingLeft: '28%'}} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name='recipe-book' size={32} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '18%', paddingLeft: '28%'}} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="budget" size={37} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '15%', paddingLeft: '28%'}} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="food-stock" size={30} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '18%', paddingLeft: '24%'}} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="food-diary" size={35} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '15%', paddingLeft: '29%'}} />
                    </TouchableOpacity>
                </View>
                            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
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
        height: '15%',
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 238, 238, 0.5)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },

    searchContainer: {
        // height: 45,
        width: '90%',
        // backgroundColor: 'white',
        flex: 1,
        position: 'absolute',
        top: 0,
        marginTop:hPercentage('7%'),
    },

    searchInputContainer: {
        // backgroundColor: 'white',
        width: '100%',
        // marginTop: -5,
    },

    searchInput: {
        fontSize: 15,
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

     /*------------------------------------------------------------------------
        Autocomplete Section
    ------------------------------------------------------------------------*/
    
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    
    itemText: {
        fontSize: 15,
        margin: 2
    },

    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        // backgroundColor: '#F5FCFF',
        marginTop: 25
      },
});