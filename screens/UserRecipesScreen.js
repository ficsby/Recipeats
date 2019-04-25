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

import * as firebase from 'firebase';

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
import CreateRecipeModal from './components/CreateRecipeModal';

// import NewsItem from './components/NewsItem';
// import apiUtils from '../api/apiUtils.js';
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class UserRecipesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            recipeModalVisible: false,
            query: '',
            isLoading: true,
            recipeCreated: false,
            customRecipes: [],
            bookmarkedRecipes: [],
        };
        this.toggleRecipeModalVisibility = this.toggleRecipeModalVisibility.bind(this);
        this.renderCustomRecipes = this.renderCustomRecipes.bind(this);
        this.renderBookmarks = this.renderBookmarks.bind(this);
        this.showCreateRecipeModal = this.showCreateRecipeModal.bind(this);
        this.showRecipeScreen = this.showRecipeScreen.bind(this) // Calls the NavigationService.navigate
    };

    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="home" style ={{fontSize: 24, color:tintColor}} />
        )
    } 

    async componentDidMount() {
		console.log('test');
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        this.getCustomRecipesFromFirebase();
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
    
    getCustomRecipesFromFirebase(){
        // Returns a promise of the user's value
        retrieveData = () => {
            userId = firebase.auth().currentUser.uid;
            ref = firebase.database().ref("customRecipes/" + userId + "/");
            return ref.once("value");
        };
        context = this;
        retrieveData().then(snapshot => {
            customRecipeSnapshot = snapshot.val();
            recipes = [];
            if(context.state.customRecipes.length != Object.keys(customRecipeSnapshot).length)
            {
                for (var key in customRecipeSnapshot) {
                    if (customRecipeSnapshot.hasOwnProperty(key)) {
                        recipes.push(customRecipeSnapshot[key]);
                    }
                }

                context.setState({
                    customRecipes: recipes
                });
            }
        });
    }

    getBookmarkedRecipesFromFirebase(){
        retrieveData = () => {
            userId = firebase.auth().currentUser.uid;
            ref = firebase.database().ref("bookmarkedRecipes/" + userId + "/");
            return ref.once("value");
        };
        // bookmarkedRecipes
        context = this;
        retrieveData().then(snapshot => {
            bookmarkedRecipeSnapshot = snapshot.val();
            recipes = [];
            if(context.state.bookmarkedRecipes.length != Object.keys(bookmarkedRecipeSnapshot).length)
            {
                for (var key in bookmarkedRecipeSnapshot) {
                    if (bookmarkedRecipeSnapshot.hasOwnProperty(key)) {
                        recipes.push(bookmarkedRecipeSnapshot[key]);
                    }
                }

                context.setState({
                    bookmarkedRecipes: recipes
                });
            }
        });
    }
    /**
     *  Renders the user's custom recipes, in which each item in customRecipes is mapped as a RecipeListItem. 
     *  Each RecipeListItem displays the title, image, serving size, cook time
     */
    renderCustomRecipes() {
		if(this.state.customRecipes)
		{
			return this.state.customRecipes.map((recipe, index) => {
				return <RecipeListItem  parent={this} item={recipe} rowId={index} sectionId={1} bookmarked={false}/>  //sectionId 1 refers to custom recipes
			});
		}
        return <Text>No custom recipes to show</Text>
    };

    /**
     *  Renders bookmarks, in which each item in bookmarkedRecipes is mapped as a RecipeListItem. 
     *  Each RecipeListItem displays the title, image, serving size, cook time
     */
    renderBookmarks() {
        return this.state.bookmarkedRecipes.map((recipe, index) => {
            return <RecipeListItem parent={this} item={recipe} rowId={index} sectionId={2} bookmarked={true} />  //sectionId 2 refers to bookmarked recipes
        });
    };

    showCreateRecipeModal() {
        return(
            <CreateRecipeModal isModalVisible={this.state.recipeModalVisible} parent={this} />
        );
    }

  
    toggleRecipeModalVisibility() {
        this.setState({  recipeModalVisible: !this.state.recipeModalVisible  });
    };

    
  showRecipeScreen(newRecipe){
    NavigationService.navigate('RecipeScreen', 
                                  { 
                                    editable: true,
                                    recipeId: newRecipe.id,
                                    title: newRecipe.title,
                                    servings: newRecipe.servings,
                                    readyInMinutes: newRecipe.readyInMinutes,
                                    calories: newRecipe.calories,
                                    protein: newRecipe.protein,
                                    carbs: newRecipe.carbs,
                                    fats: newRecipe.fats,
                                    extendedIngredients: [],
                                    instructions: []
                                  }
                            );
    this.setState({recipeCreated: false});
  };

    render() {
        // if (this.state.isLoading) {
        //     return <LoadingScreen />;
        // };
        this.getCustomRecipesFromFirebase();
        this.getBookmarkedRecipesFromFirebase();
        if (this.state.recipeCreated)
        {
            this.showRecipeScreen(this.state.customRecipes[[this.state.customRecipes.length-1]]);
        }
        return (
            <View style={styles.pageContainer}>
                <SearchHeaderNav/>

                {this.showCreateRecipeModal()}

                <ScrollableTabView  renderTabBar={() => ( <ScrollableTabBar  style={styles.scrollStyle} tabStyle={styles.tabStyle} /> )}
                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarInactiveTextColor={'black'}
                tabBarActiveTextColor={'rgba(214, 104, 92, 1)'}
                tabBarUnderlineStyle={styles.underlineStyle}
                initialPage={0}
                >

                <View key={'1'} tabLabel={'Custom Recipes'} style={styles.tabContentStyle}>
                    <ScrollView>
                        <View style={styles.customRecipesContainer}>
                            {this.renderCustomRecipes()}
                        </View>
                    </ScrollView>
                    
                <View style={styles.behindIcon}></View>

                <TouchableOpacity style={styles.createRecipeButton} onPress={() => this.toggleRecipeModalVisibility()}>
                    <Icon name='plus-circle' size={50} color='rgb(196, 70, 70)' />
                </TouchableOpacity>

                </View>
                <View key={'2'} tabLabel={'Bookmarks'} style={styles.tabContentStyle}>   
                    <ScrollView>
                        <View style={styles.bookmarksContainer}>
                            {this.renderBookmarks()}
                        </View>
                    </ScrollView>
                </View>

                </ScrollableTabView>       
        </View>
        );
    }
}

const styles = StyleSheet.create({

    /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/

    behindIcon: {
        flex: 0,
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 100,
        right: 28,
        bottom: 28,
        height: 50,
        width: 50,
    },

    
    createRecipeButton: {
        flex: 2,
        alignSelf: 'flex-end',
        position: 'absolute',
        borderRadius: 120,
        borderColor: 'rgb(178, 60, 60)',
        borderWidth: 2,
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

    /*------------------------------------------------------------------------
        Tabs Styles
    ------------------------------------------------------------------------*/
    tabStyle: {
    },

    tabContentStyle: {
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
});