import React, { Component } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
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

// Fetch News Components
import Button from './components/Button';
import NewsItem from './components/NewsItem';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            recipes: [],
            news_items: 
            [
                {
                    pretext: '',
                    title: 'Brain Foods to Make You Smarter',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ex ea commodo consequat.',
                    image: require('./../assets/images/newsimage1.jpg'),
                },
                {
                    pretext: '',
                    title: 'Eat Healthy to Live Healthy',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ex ea commodo consequat.',
                    image: require('./../assets/images/newsimage2.jpg')
                },
                {
                    pretext: '',
                    title: 'Best Kitchenware for Measuring Food',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ex ea commodo consequat.',
                    image: require('./../assets/images/newsimage3.jpg')
                },
            ],
        };
    };

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
   getRecipeSearchResultsByName = () => {
    currentThis = this;   // Need to keep a reference of the current 'this' because the 'this' context changes in the callback of the promise

    // Returns a promise which then gets the result from the request call
    const fetchRecipeByNamePromise = fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=chicken`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2"     // API key registered for Spoonacular API
        },
    });

    const fetchRecipeByNameResponse = fetchRecipeByNamePromise.then(function(response) { return response.json(); })
    // Check if component is mounted before changing state, this check is to prevent memory leaks
    if(this._ismounted)
    {
        fetchRecipeByNameResponse.then(function(json){
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
    };

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
     };


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

    newsItemPress(txt) {
        console.log(txt);
    };

    renderNews() {
        return this.state.news_items.map((news, index) => {
            return <NewsItem key={index} index={index} news={news} />
        });
    };
    
    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();
        this.getRecipeSearchResultsByName();

        return (
            <View style={styles.pageContainer}>
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
                
                <ScrollView style={styles.newsContainer}>

                    <View style={styles.foodTipContainer}>

                        <View style={styles.row}>
                            <Icon name='lightbulb' size={30} color='rgba(0,0,0,1)' height={200} style={{marginRight: 10}} />
                            <Text style={styles.foodTipHeader}> Food Tip of the Day </Text>
                        </View>
                        
                        <Text style= {styles.foodTip}> 
                            Use ice cube trays to freeze small portions of pesto, broth, applesauce and pizza sauce. 
                            Transfer the cubes to a Ziplock bag or other freezer-proof container and it will be easy 
                            to pull out exactly how much you need.
                        </Text>
                    </View>

                    {/* <Text style={{fontSize:100, color: 'black'}}> Hi 2</Text> */}
                    { this.renderNews() }
                </ScrollView>
                
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
    pageContainer: {
        flex: 1,
        width: '100%',
    },

    topContainer: {
        width: '100%',
        height: 80,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: 'rgba(244, 238, 238, 0.9)',
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
    foodTipContainer: {
        backgroundColor: 'rgba(255, 232, 229, 0.4)',
        borderColor: 'rgba(229, 195, 204, 1)',
        borderWidth: 2,
        paddingTop: 15,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 20,
    },

    foodTipHeader: {
        width: '100%',
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 10,
    },

    foodTip: {
        fontSize: 15,
    },

    // header: {
    //     flexDirection: 'row',
    //     backgroundColor: '#FFF',
    //     padding: 5,
    //     fontSize: 25,
    //     borderBottomColor: '#E1E1E1',
    //     borderBottomWidth: 1
    // },

    // headerButton: {
    //     flex: 1,
    // },

    // headerText: {
    //     flex: 1,
    // },

    // headerTextLabel: {
    //     width: '100%',
    //     fontSize: 20,
    //     textAlign: 'center'
    // },

    newsContainer: {
        backgroundColor: 'rgba(255,255,255,1)',
        alignContent: 'center',
        width: '100%',
    },

    whitespace: {
        flex: 1
    },
    
    backButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    // back_button_label: {
    //     color: '#397CA9',
    //     fontSize: 20,
    // },

    /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(225, 218, 218, 0.7)'},
    },

);