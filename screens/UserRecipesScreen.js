import React, { Component } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert, Modal, SafeAreaView } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import SearchHeaderNav from './../navigation/SearchHeaderNav';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'
import LoadingScreen from './LoadingScreen';
import RecipeListItem from './components/RecipeListItem'

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
// import NewsItem from './components/NewsItem';
// import apiUtils from '../api/apiUtils.js';
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class UserRecipesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            query: '',
            isLoading: true,
            customRecipes: 
            [
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                }
            ],
            
            bookmarkedRecipes: 
            [
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                },
                {   
                    id: 556177,
                    title: 'Ramen Noodle Coleslaw',
                    servings: '4 servings',
                    readyInMinutes: '60 mins',
                    image: './../../assets/images/ramen-noodle-coleslaw.jpg',
                }
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

        // Get bookmarks and custom recipes from firebase here
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

    /**
     *  Renders bookmarks, in which each item in bookmarkedRecipes is mapped as a RecipeListItem. 
     *  Each RecipeListItem displays the title, image, serving size, cook time
     */
    renderBookmarks() {
        return this.state.bookmarkedRecipes.map((recipe, index) => {
            return <RecipeListItem key={index} item={recipe} index={index} type={1} />  //type 1 refers to bookmarked recipes
        });
    };

    /**
     *  Renders the user's custom recipes, in which each item in customRecipes is mapped as a RecipeListItem. 
     *  Each RecipeListItem displays the title, image, serving size, cook time
     */
    renderCustomRecipes() {
        return this.state.customRecipes.map((recipe, index) => {
            return <RecipeListItem key={index} item={recipe} index={index} type={2} />  //bott 1 refers to custom recipes
        });
    };
  
    renderCreateRecipeButton() {
        return(
            <TouchableOpacity style={styles.createRecipeButton}>
                <Icon name='plus-circled' size={47} color='rgba(100, 92, 92, 0.8)' />
            </TouchableOpacity>
        );
    };

    render() {
        // if (this.state.isLoading) {
        //     return <LoadingScreen />;
        // };
        
        return (
            <View style={styles.pageContainer}>
                <SearchHeaderNav/>
                <ScrollableTabView  renderTabBar={() => ( <ScrollableTabBar  style={styles.scrollStyle} tabStyle={styles.tabStyle} /> )}
                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarInactiveTextColor={'black'}
                tabBarActiveTextColor={'rgba(214, 104, 92, 1)'}
                tabBarUnderlineStyle={styles.underlineStyle}
                initialPage={0}
                >

                <View key={'1'} tabLabel={'Your Recipes'} style={styles.tabContentSyle}>
                    <ScrollView>
                        <View style={styles.customRecipesContainer}>
                            {this.renderCustomRecipes()}
                        </View>
                    </ScrollView>
                </View>
                <View key={'2'} tabLabel={'Bookmarks'} style={styles.tabContentSyle}>   
                    <ScrollView>
                        <View style={styles.bookmarksContainer}>
                            {this.renderBookmarks()}
                        </View>
                    </ScrollView>
                </View>

                </ScrollableTabView>       

                {this.renderCreateRecipeButton()}
     
        </View>
        );
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

    
    createRecipeButton: {
        flex: 2,
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 25,
        bottom: 25
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
        Tabs Styles
    ------------------------------------------------------------------------*/
    tabStyle: {
    },

    tabContentSyle: {
        flex: 1,
        backgroundColor: 'rgb(247, 247, 247)',
    },

    scrollStyle: {
        backgroundColor: 'white',
        // justifyContent: 'center',
    },

    tabBarTextStyle: {
        width: wPercentage('20%'),
        fontSize: 14,
        fontWeight: 'normal',
    },

    underlineStyle: { 
        height: 3,
        backgroundColor: 'red',
        borderRadius: 3,
        width: 30,
    },

    customRecipesContainer: {
        // backgroundColor: 'white',
        // paddingRight: 30,
        // paddingLeft: 30,
        // paddingTop: 20,
        // paddingBottom: 30,
        // marginTop: 13,
        // marginBottom: 13,
    },

    bookmarksContainer: {
        // backgroundColor: 'white',
        // paddingRight: 30,
        // paddingLeft: 30,
        // paddingTop: 20,
        // paddingBottom: 30,
        // marginTop: 13,
        // marginBottom: 13,
    },

    get bookmarksContainer() {
        return this._bookmarksContainer;
    },
    set bookmarksContainer(value) {
        this._bookmarksContainer = value;
    },

    bookmarksHeader: {
        width: '100%',
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 40,

    },

    bookmarks: {
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