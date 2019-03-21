import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer , DrawerItems } from 'react-navigation';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import SearchHeader from 'react-native-search-header';
import NavigationService from './NavigationService';

const fetch = require('node-fetch');

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');

export default class SearchHeaderNav extends React.Component {
    state = {
        query: '',
        recipes: [],
        recipeTitle: '',
        recipeId: '',
    };

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
    async getRecipes(text){
        this.setState({query: text});

        try{
            // Returns a promise which then gets the result from the request call
            const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=${this.state.query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2"     // API key registered for Spoonacular API
                },
            });

            const json = await response.json();
            this.setState({recipes: json});
            
        } catch (err) {
            console.log(err);
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
        NavigationService.navigate('EditAccount');
    };

    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();
        console.log('test2');
        return (
            <View>
                <View style={styles.topContainer}>

                    <View style={styles.row}>

                        {/* Side bar navigation icon */}
                        <TouchableOpacity onPress = { () => NavigationService.openDrawer()}>
                            <Icon name='menu' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200}

                                style={{marginLeft: 18}} />
                        </TouchableOpacity>

                        {/* User account icon  */}
                        <TouchableOpacity onPress ={this.onAccountIconPress} >
                            <Icon name='user' size={25} color='rgba(175,76,99,1)'
                                style={{marginLeft: (WIDTH - 85)}} />
                        </TouchableOpacity>

                    </View>
                
                </View>

                <Autocomplete
                    containerStyle={styles.searchContainer}  
                    inputContainerStyle={styles.searchInputContainer}
                    data={recipes.length === 1 && comp(query, recipes[0].title) ? [] : recipes}
                    defaultValue = { query }
                    autoCorrect={false}
                    placeholder= "    Search recipes, ingredients..."
                    onChangeText={text => this.getRecipes(text)}
                    
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