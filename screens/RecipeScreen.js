import React from 'react';
import { StyleSheet, Image, ImageBackground, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem, Badge } from 'react-native-elements';
// import Bar from 'react-native-bar-collapsible';
import { Font, AppLoading } from 'expo';
//import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');
const fetch = require('node-fetch');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";
const ingredientsList = [   // FOR TESTING PURPOSES
    {
        name: 'Rice',
        quantity: '4 cups'
    },
    {
        name: 'Peas',
        quantity: '1 cup, canned'
    },
    {
        name: 'Carrots',
        quantity: '1 cup, diced'
    },
    {
        name: 'Corn',
        quantity: '4 cups, canned'
    },
    {
        name: 'Garlic',
        quantity: '3 Tbsp, minced'
    },
    {
        name: 'Vegetable Oil',
        quantity: '2 Tbsp'
    },
  ];

  const instructionsList = [   // FOR TESTING PURPOSES
    {
        instruction: "In a saucepan, combine rice and water. Bring to a boil. Reduce heat, cover, and simmer for 20 minutes."
    },
    {
        instruction: "In a small saucepan, boil carrots in water about 3 to 5 minutes. Drop peas into boiling water, and drain."
    },
    {
        instruction: "Heat wok over high heat. Pour in oil, then stir in carrots and peas; cook about 30 seconds."
    },
    {
        instruction: "Enjoy! (: "
    },
  ];

export default class HomeScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            query: '',
            recipes: [],
            bookmarked: false,
            liked: false,

            id: 0,
            title: '',
            instructions: '',
            servings: 0,
            readyInMinutes: '',

            sourceUrl: '',
            creditText: '',
            sourceName: '',
            image: '',

            extendedIngredients: [],
            nutritionalTags: {'vegetarian': false,
                              'vegan': false,
                              'glutenFree': false,
                              'dairyFree': false,
                              'veryHealthy': false,
                              'cheap': false,
                              'veryPopular': false,
                              'sustainable': false,
                              'weightWatcherSmartPoints': false,
                              'lowFodmap': false,
                              'keotgenic': false,
                              'whole30': false,
                             },
            // // Ingredient Data
            // aisle: '',
            // test: '',
            // search: '',
        };
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleHeart = this.toggleHeart.bind(this);
    };

    getRecipeInfoFromId = (id) => {
        currentThis = this;

        // Returns a promise which then gets the result from the request call
        const fetchRecipeInfoByIdPromise = fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/479101/information`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
            },
        });

        const fetchRecipeInfoByIdResponse = fetchRecipeInfoByIdPromise.then(function(response) { return response.json(); })
        // Check if component is mounted before changing state, this check is to prevent memory leaks
        if(this._ismounted)
        {
            nutrtionTags = {}
            fetchRecipeInfoByIdResponse.then(function(json){
                for(key in json)
                {   
                    if(key in currentThis.state){
                        currentThis.setState({
                            [key]: json[key]
                        });
                    }
                    else if(key in currentThis.state.nutritionalTags)
                    {
                        nutrtionTags[key] = json[key];
                    }
                }

                currentThis.setState({
                    nutritionalTags: nutrtionTags
                });
            })
        }
    }

    toggleBookmark() {
        this.setState({  bookmarked: !this.state.bookmarked  });
    };

    // Toggles the like state when the "Heart" icon is tapped
    toggleHeart() {
        this.setState({  liked: !this.state.liked });
    };

    // Renders the icon according to its current state
    renderIcon(iconType) {
        if(iconType == "bookmark")
        {
            bookmarkStatus = this.state.bookmarked? "bookmark" : "bookmark-empty";
            return (
                <Icon name={bookmarkStatus} size={28} color='rgba(175,76,99,1)'
                      style={{paddingTop: 6, paddingLeft: 13}} />
            );
        }

        if(iconType == "heart")
        {
            heartStatus = this.state.liked? "heart" : "heart-empty";
            return (
                <Icon name={heartStatus} size={28} color='rgba(175,76,99,1)'
                      style={{paddingTop: 6}} />
            );
        }
    };
    
    async componentDidMount() {
        this._ismounted = true;
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        this.getRecipeInfoFromId(this.recipeID);
    };

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

        const { search } = this.state;
        console.log("------------------------ START HERE ----------------------");
        test =JSON.stringify(this.state.extendedIngredients[0]); // Works
        console.log(Object.values(this.state.extendedIngredients));  // Works
        console.log(Object.values(this.state.extendedIngredients[0])); // Doesn't work ( Says that the input parameter is null or undefined )


        return ( 
            <View> 

{               /*---------------------------------------------------------------------------------
                   Top Bar 
                ------------------------------------------------------------------------------------*/}
                
                {/* Top panel of page. Contains the menu and user account buttons. 
                    Does not actually contain the Autocomplete Search Bar, but is visually underneath it  */}
                <View style={styles.topContainer}>
                    <View style={styles.row}>
                        {/* Side bar navigation icon  */}
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
                {/* <Autocomplete
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
                /> */}

                {/*---------------------------------------------------------------------------------
                   Recipe Page Contents 
                ------------------------------------------------------------------------------------*/}
                
                <ScrollView style={styles.recipeContainer}> 

                    {/* <ImageBackground source={require('./../assets/images/test_photo.jpg')} /> */}
                    <ImageBackground source={require('./../assets/images/test_photo.jpg')} style={styles.image}>
                    </ImageBackground>
                    <View style={styles.contents}>

                        <View style={styles.titleContainer}>
                            <View style={styles.row}>
                                <Text style={styles.title}> 
                                    {/* {this.state.title}   */}
                                </Text>
                                
                                <TouchableOpacity  onPress={this.toggleHeart} >
                                    {this.renderIcon("heart") }
                                </TouchableOpacity>

                                <TouchableOpacity  onPress={this.toggleBookmark} >
                                    {this.renderIcon("bookmark") }
                                </TouchableOpacity>
                                        
                            </View>

                            <View style={styles.row}>
                                <Icon style={styles.statsIcon} name='clock' size={13} color='rgba(0,0,0, 0.5)' />
                                <Text style={styles.stats}> 60 mins </Text>
                                <Icon style={styles.statsIcon} name='adult' size={13} color='rgba(0,0,0, 0.5)' />
                                <Text style={styles.stats}> 2 servings </Text>
                            </View>
                        </View>

                        <View style ={styles.descriptionContainer}>
                            <Text style={styles.description}> 
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                        </View>

                        <View style ={styles.macrosContainer}>
                            <View style ={styles.macrosColumn}> 
                                <Text style ={styles.macrosData}>  1000  </Text>
                                <Text style ={styles.macrosLabel}>  CALORIES </Text>
                            </View>
                            <View style ={styles.macrosColumn}> 
                                <Text style ={styles.macrosData}>  200g </Text>
                                <Text style ={styles.macrosLabel}>  PROTEIN </Text>
                            </View>
                            <View style ={styles.macrosColumn}>
                                <Text style ={styles.macrosData}> 25g </Text>
                                <Text style ={styles.macrosLabel}>  CARBS </Text>
                            </View>
                            <View style={styles.macrosColumn}>
                                <Text style ={styles.macrosData}>  10g </Text>
                                <Text style ={styles.macrosLabel}> FATS </Text>
                            </View>
                        </View>

                        <View style ={styles.sectionContainer}>
                            < Text style={styles.sectionTitle}> Ingredients </Text>

                            {
                                ingredientsList.map( (item, i) =>  
                                ( <ListItem key={i} title={item.name} rightTitle={item.quantity} 
                                            titleStyle={styles.ingredientText} rightTitleStyle={styles.quantityText} /> ))
                                // this.state.extendedIngredients.map( (item, i) =>  
                                // ( <ListItem key={i} title={item.name} rightTitle={item.amount} 
                                //             titleStyle={styles.ingredientText} rightTitleStyle={styles.quantityText} /> ))
                                    
                            }
                            <TouchableOpacity  onPress={this.compareFoodLists} style={{alignItems: 'flex-end', marginRight: 15, paddingTop: 20}}>
                                <Icon name='checklist-2' size={26} color='rgba(0,0,0,0.6)' />
                            </TouchableOpacity>
                        </View>

                        {/* contentContainerStyle={styles.numberContainer} rightContentContainerStyle={styles.instructionStepContainer} />  */}

                        <View style ={styles.sectionContainer}>
                            < Text style={styles.sectionTitle}> Instructions </Text>
                            {
                                instructionsList.map( (item, i) =>  
                                ( <ListItem key={i} title={item.instruction} leftIcon={<Badge value={i+1} 
                                    containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} /> } 
                                            /> ))
                            }
                        </View>

                        {/* Padding at the bottom as a buffer */}
                        <View style={{paddingBottom: 130}} />
                    </View>


                </ScrollView>

                <View style={styles.menubarRow}> 
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

    collapsibleBar: {
        backgroundColor: 'rgba(255,255,255,1)',
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },

    collapsibleTitle: {
        marginLeft: 15,
        color: 'rgba(0,0,0,0.9)',
        fontSize: 18,
    },

    recipeRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
    },

    contents: {
        marginTop: 5,
        marginBottom: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
        flex: 1,
        width: '100%',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },

    searchResult: {
        width: '100%',
    },


/*------------------------------------------------------------------------
    Recipe Info Section
------------------------------------------------------------------------*/

    recipeContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },

    image: {
        //position: 'relative',
        width: '100%',
        height: 300,
    },

    titleContainer: {
        marginTop: -5,
        paddingTop: 5,
        backgroundColor: 'rgba(255,255,255,1)',
    },

    title: {
        marginLeft: 13,
        marginRight: 13,
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    stats: {
        fontSize: 16,
        color: 'rgba(0,0,0, 0.5)',
        marginLeft: 5,
    },
    
    statsIcon: {
        marginTop: 3,
        marginLeft: 20,
        fontSize: 15,
        color: 'rgba(0,0,0, 0.5)',
    },

        
    /*-----------------------
        Description
    -------------------------*/

    descriptionContainer: {
        paddingBottom: 5,
        backgroundColor: 'rgba(255,255,255,1)',
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(0,0,0,0.3)',
    },

    description: {
        marginTop: 8,
        marginBottom: 15,
        marginLeft: 17,
        marginRight: 17,
        fontSize: 14,
        color: 'rgba(0,0,0, 0.8)',
    },

    /*-----------------------
        Macros
    -------------------------*/

      macrosContainer: {
        paddingTop: 20,
        marginBottom: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        height: 80,
        backgroundColor: 'rgba(255,255,255,1)',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.2)',
        borderBottomColor: 'rgba(0,0,0,0.15)',
    },

    macrosLabel: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
    },

    macrosData: {
        textAlign: 'center',
        fontSize: 15,
    },

    
    /*-----------------------
        Recipe Sections
    -------------------------*/
    
    sectionContainer: {
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: 'rgba(0,0,0,0.15)',
        borderTopColor: 'rgba(0,0,0,0.15)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    sectionTitle: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 20,
        fontSize: 20,
        fontWeight: '600',
    },

    /*-----------------------
       Ingredients
    -------------------------*/

    ingredientText: {
        width: '80%',
        fontSize: 14,
        marginLeft: 20,
        marginBottom: -15,
    },

    quantityText: {
        width: '100%',
        fontStyle: 'italic',
        marginRight: 20,
        marginBottom: -15,
    },


    /*-----------------------
       Instructions
    -------------------------*/

    instructionStepContainer: {
        marginRight: 35,
        marginLeft: '-100%', 
        justifyContent: 'flex-start',
    },

    instructionStep: {
        width: '100%',
        fontSize: 16,
    },

    numberContainer: {
        marginLeft: 10,
        marginRight: 15,
    },

    numberBadge: {
        backgroundColor: 'rgba(68, 72, 76, 0.6)',
        borderRadius: 100,
        width: 30,
        height: 30,
    },

    instructionNumber: {
        width: '100%',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },

    /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
    
    menubarRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 50,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 90,
    },

    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(246, 238, 238, 1)',
        borderTopColor: 'rgba(225, 218, 218, 0.7)',
        borderTopWidth: 2.1,
    },
    
});