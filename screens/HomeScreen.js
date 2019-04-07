import React, { Component } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert, Modal, SafeAreaView } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import SearchHeaderNav from './../navigation/SearchHeaderNav';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

//import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
import NavigationService from '../navigation/NavigationService.js';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('./../styles/GlobalStyles.js');

// Fetch News Components
const fetch = require('node-fetch');

import Button from './components/Button';
import NewsItem from './components/NewsItem';
import apiUtils from '../api/apiUtils.js';
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            query: '',
            recipes: [],
            foodTrivia: '',
            text: '',
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

    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="home" style ={{fontSize: 24, color:tintColor}} />
        )
    } 

    async componentDidMount() {
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        apiUtils.getRandomFoodTrivia(this);
    };

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
     };


    onAccountIconPress = () => {
        // var navActions = StackActions.reset({
        //     index: 1,
        //     actions: [
        //         // We need to push both the current screen and the next screen that we are transitioning to incase the user wants to go to previous screen
        //         StackActions.push({ routeName: "Home" }),       
        //         StackActions.push({ routeName: "EditAccount" }),
        //     ]
        // });

        // this.props.navigation.dispatch(navActions);
        this.setState({visible: true});
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
        console.log("\n\nFood Trivia: ", this.state.foodTrivia);

        return (
            <SafeAreaView style = {globalStyles.droidSafeArea}>
                <SearchHeaderNav/>
                <View style={styles.pageContainer}>
                    {/* Top panel of page. Contains the menu and user account buttons. 
                        Does not actually contain the Autocomplete Search Bar, but is visually underneath it  */}
                    <ScrollView style={styles.newsContainer}>
                            <View style={styles.foodTriviaContainer}>

                                <View style={styles.row}>
                                    <Icon name='lightbulb' size={30} color='rgba(0,0,0,1)' height={200} style={{marginLeft: 15}} />
                                    <Text style={styles.foodTriviaHeader}> Food Trivia of the Day </Text>
                                </View>
                                
                                <Text style= {styles.foodTrivia}> 
                                    Use ice cube trays to freeze small portions of pesto, broth, applesauce and pizza sauce. 
                                    Transfer the cubes to a Ziplock bag or other freezer-proof container and it will be easy 
                                    to pull out exactly how much you need.
                                </Text>
                            </View>

                            {/* <Text style={{fontSize:100, color: 'black'}}> Hi 2</Text> */}
                            { this.renderNews() }
                    </ScrollView>
                </View>
            </SafeAreaView>
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
    foodTriviaContainer: {
        backgroundColor: 'white',
        paddingRight: 25,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 30,
        marginTop: 13,
        marginBottom: 13,
    },

    foodTriviaHeader: {
        width: '100%',
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 40,

    },

    foodTrivia: {
        paddingLeft: 13,
        paddingRight: 13,
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
        backgroundColor: 'rgba(226, 226, 226, 0.5)',
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