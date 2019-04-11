import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Button, Image,  Dimensions, TouchableOpacity, Alert, SafeAreaView, Picker, BackHandler  } from 'react-native';
import Modal from 'react-native-modal';
import Autocomplete from 'react-native-autocomplete-input';
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import ApiUtils from './../api/apiUtils';
// import globalStyles from './../styles/GlobalStyles';
var globalStyles = require('./../styles/GlobalStyles.js');

import * as firebase from 'firebase';
import NavigationService from '../navigation/NavigationService.js';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get('window').height;
const { width: WIDTH } = Dimensions.get('window');

export default class SearchResultScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkBoxModalVisible: false,
            visible: false,
            query: '',
            recipes: [],
            recipeTitle: '',
            recipeId: '',
            searchResults: []
        };
    }

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
    async getRecipesByName(){
        const name = NavigationService.getTopLevelNavigator().state.params.name;
        const cuisine = NavigationService.getTopLevelNavigator().state.params.cuisine;
        const diet = NavigationService.getTopLevelNavigator().state.params.diet;
        const intolerances = NavigationService.getTopLevelNavigator().state.params.foodIntolerances;
        await ApiUtils.searchRecipeByName(name, cuisine, diet, intolerances, this);
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
        'dancing-script': require('./../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        this.getRecipesByName()
        // this.setState({searchResults:})
    }

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
    }

    render() {
        // console.log("Query Result from Search Screen: " + NavigationService.getTopLevelNavigator().state.params.queryResult);
        // console.log("Food Intolerances Result from Search Screen: " + NavigationService.getTopLevelNavigator().state.params.foodIntolerances);
        return (
            <ScrollView styles={styles.searchScreenContainer}>
                
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
    searchScreenContainer: {
        fontFamily:'dancing-script'
    },  

    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },

    col: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },

    filters: {
        fontSize: 25,
        color: 'rgba(175,76,99,1)',
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

    itemTextContainer: {
        width: '100%',
        marginLeft: 10,
    },

    itemText: {
        width: '100%',
    },

    intoleranceBox: {
        width: wPercentage('30%'),
    },

    droidSafeArea: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    checkBoxModalContainer: {
        backgroundColor: 'white',
        width: wPercentage('90%'),
        height: hPercentage('50%'),
    },

    checkBoxModal:{
        position: 'absolute',
        top: '25%',
        width: wPercentage('90%'),
        height: hPercentage('40%'),
    }
});