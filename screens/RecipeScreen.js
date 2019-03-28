import React from 'react';
import { StyleSheet, Image, ImageBackground, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem, Badge } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
// import NavigationService from '../navigation/NavigationService.js';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const fetch = require('node-fetch');

import LoadingScreen from './LoadingScreen';
import apiUtils from '../api/apiUtils.js';

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/GlobalStyles.js');
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
            isLoading: true,

            query: '',
            recipes: [],
            bookmarked: false,
            liked: false,

            id: 479101,
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
        };
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleHeart = this.toggleHeart.bind(this);
    };

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
                // <Icon name={bookmarkStatus} size={28} color='rgba(175,76,99,1)'
                //       style={{paddingTop: 6, paddingLeft: 13}} />
                  <Icon name={bookmarkStatus} size={28} color='rgba(255,255,255,1)' style={styles.overlayButtons} />
            );
        }

        if(iconType == "heart")
        {
            heartStatus = this.state.liked? "heart" : "heart-empty";
            return (
                // <Icon name={heartStatus} size={28} color='rgba(175,76,99,1)'
                //       style={{paddingTop: 6}} />
                <Icon name={heartStatus} size={28} color='rgba(255,255,255,1)' style={styles.overlayButtons} />
            );
        }
    };
    
    async componentDidMount() {
        this._ismounted = true;
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});

        const data = await apiUtils.getRecipeInfoFromId(this.state.id, this);
        
        if(data != null)
        {
            this.setState({ isLoading: false });
        }
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
           
        if (this.state.isLoading) {
            return <LoadingScreen />;
        }

        return ( 
            <View> 
                {/*---------------------------------------------------------------------------------
                   Recipe Page Contents 
                ------------------------------------------------------------------------------------*/}
                
                <ScrollView style={styles.recipeContainer}> 

                    {/* <ImageBackground source={require('./../assets/images/test_photo.jpg')} /> */}
                    <ImageBackground source={{ uri: this.state.image}} style={styles.image}>
                        <View style={styles.overlayButtonsContainer}> 
                            <TouchableOpacity onPress={this.toggleHeart} >
                                {this.renderIcon("heart") }
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.toggleBookmark} >
                                {this.renderIcon("bookmark") }
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.downloadRecipe} >
                                <Icon name='download' size={27} color='rgba(255,255,255,1)' style={styles.overlayButtons}/>   
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    <View style={styles.contents}>

                        <View style={styles.titleContainer}>
                            <View style={styles.row}>
                                <Text style={styles.title}> 
                                    {this.state.title}  
                                </Text>
                            </View>

                            <View style={styles.statsContainer}>
                                <Icon style={styles.statsIcon} name='clock' size={13} color='rgba(0,0,0, 0.5)' />
                                <Text style={styles.stats}> {this.state.readyInMinutes} mins </Text>
                                <Icon style={styles.statsIcon} name='adult' size={13} color='rgba(0,0,0, 0.5)' />
                                <Text style={styles.stats}> {this.state.servings} servings </Text>
                            </View>
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

    overlayButtonsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 0,
        right: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 3,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    overlayButtons: {
        paddingTop: 6, 
        paddingRight: 22,
    },

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
        marginTop: 10,
        marginLeft: 25,
        marginRight: 25,
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        marginLeft: 10,
        paddingBottom: 15,
    },


    stats: {
        fontSize: 18,
        color: 'rgba(0,0,0, 0.8)',
        marginLeft: 6,
    },
    
    statsIcon: {
        marginTop: 3,
        marginLeft: 15,
        fontSize: 18,
        color: 'rgba(0,0,0, 0.5)',
    },

        
    /*-----------------------
        Description
    -------------------------*/

    // descriptionContainer: {
    //     paddingBottom: 5,
    //     backgroundColor: 'rgba(255,255,255,1)',
    //     // borderBottomWidth: 1,
    //     // borderBottomColor: 'rgba(0,0,0,0.3)',
    // },

    // description: {
    //     marginTop: 8,
    //     marginBottom: 15,
    //     marginLeft: 17,
    //     marginRight: 17,
    //     fontSize: 14,
    //     color: 'rgba(0,0,0, 0.8)',
    // },

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