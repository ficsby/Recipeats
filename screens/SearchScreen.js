import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image,  Dimensions, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import ApiUtils from './../api/apiUtils';
// import globalStyles from './../styles/GlobalStyles';
var globalStyles = require('./../styles/GlobalStyles.js');

import * as firebase from 'firebase';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');

const cuisines = [
    'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian',
    'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun',
    'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american'
]

const diet = [
    'pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'vegetarian'
]

const intolerances = [
    'dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat'
]

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            query: '',
            recipes: [],
            recipeTitle: '',
            recipeId: '',
        };
    }

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
    async getAutoCompleteRecipesByName(text){
        this.setState({query: text});
        await ApiUtils.getAutoCompleteRecipesByName(text, this);
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

    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();

        return (
            <View styles={globalStyles.droidSafeArea}>
                <View style={styles.topContainer}>

                        <View style={styles.row}>

                            {/* Side bar navigation icon */}
                            <TouchableOpacity onPress = { () => NavigationService.openDrawer()}>
                                <Icon name='menu' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200}

                                    style={{marginLeft: 18}} />
                            </TouchableOpacity>

                            {/* User account icon  */}
                            <TouchableOpacity onPress ={this.onAccountIconPress} >
                                <Icon name='filter' size={25} color='rgba(175,76,99,1)'
                                    style={{marginLeft: (WIDTH - 85)}} />
                            </TouchableOpacity>

                        </View>
                    
                </View>
                
                    <Autocomplete
                        autoFocus={true}
                        containerStyle={styles.searchContainer}  
                        inputContainerStyle={styles.searchInputContainer}
                        data={recipes.length === 1 && comp(query, recipes[0].title) ? [] : recipes}
                        defaultValue = { query }
                        autoCorrect={false}
                        placeholder= "    Search recipes, ingredients..."
                        onChangeText={text => this.getAutoCompleteRecipesByName(text)}
                        onFocus = {this.onModalVisibleChange}
                        renderItem={({ id, title }) => (
                            <TouchableOpacity style={styles.itemTextContainer} onPress={() => this.setState({ query: title })}>
                                <Text style={styles.itemText}>
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
});