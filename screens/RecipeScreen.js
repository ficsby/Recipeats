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
// import apiUtils from '../api/apiUtils.js';

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/GlobalStyles.js');
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class RecipeScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            // isLoading: true,
            editable: false,
            query: '',
            recipes: [],
            bookmarked: false,
            liked: false,

            id: 556177,
            title: 'Ramen Noodle Coleslaw blahbalsdfadfsdfsdfasdfasdfasdf',
            servings: '4 servings',
            readyInMinutes: '60 mins',

            calories: 155,
            protein: 3,
            carbs: 8,
            fats: 16,

            sourceUrl: '',
            creditText: '',
            sourceName: '',
            imageURL: './../assets/images/ramen-noodle-coleslaw.jpg',

            extendedIngredients: [   // FOR TESTING PURPOSES
                {
                    name: 'Almonds',
                    amount: '1/4 cups'
                },
                {
                    name: 'Beef flavor ramen noodle soup mix',
                    amount: '1 package'
                },
                {
                    name: 'Shredded coleslaw mix',
                    amount: '1 bag'
                },
                {
                    name: 'Green onions',
                    amount: '5 stalks'
                },
                {
                    name: 'Olive oil',
                    amount: '2 Tbsp'
                },
                {
                    name: 'Pepper',
                    amount: '1/2 tsp'
                },
                {
                    name: 'Salt',
                    amount: '1/2 tsp'
                },
                {
                    name: 'Sugar',
                    amount: '3 Tbsp'
                },
                {
                    name: 'Sesame seeds',
                    amount: '3 Tbsp'
                },
                {
                    name: 'Vinegar',
                    amount: '3 Tbsp'
                },
                
            ],

            instructions:[   // FOR TESTING PURPOSES
                {
                    instruction: 'Toast the sesame seeds, about 350 degrees in the oven for about 10-15 minutes. Keep an eye on them to make sure they do not burn.'
                },
                {
                    instruction: 'Mix together the following to make the dressing: olive oil, vinegar, sugar, salt, pepper, green onions, chicken flavor packet from the ramen noodle package.'
                },
                {
                    instruction: 'Crush the ramen noodles until there are no large chunks (small chunks are OK).'
                },
                {
                    instruction: 'Combine the shredded cabbage and ramen noodles in a large bowl.'
                },
                {
                    instruction: 'Pour the dressing on the cabbage/noodle mixture and toss to coat.'
                },
                {
                    instruction: 'Top with the toasted sesame seeds and almonds.'
                },
              ],

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
        this.toggleEditable = this.toggleEditable.bind(this);
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
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

        // var data = apiUtils.getRecipeInfoFromId(this.state.id, this);
        // if(data != null)
        // {
        //     this.setState({ isLoading: false });
        // }        
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

    toggleEditable() {
        this.setState({
            editable: !this.state.editable
        });

        this.state.editable?  Alert.alert("Not editable now") : Alert.alert("Values should be editable now.");
    };
    
    onSaveChangesPress() {
        toggleEditable();
        Alert.alert("Saved Changes");
    }

    render() {
           
        // if (this.state.isLoading) {
        //     return <LoadingScreen />;
        // }

        return ( 
            <View> 
                {/*---------------------------------------------------------------------------------
                   Recipe Page Contents 
                ------------------------------------------------------------------------------------*/}
                
                <ScrollView style={styles.recipeContainer}> 

                    {/* <ImageBackground source={require('./../assets/images/test_photo.jpg')} /> */}
                    <ImageBackground source={require('./../assets/images/ramen-noodle-coleslaw.jpg')} style={styles.image}>
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
                                {
                                    !(this.state.editable)? 
                                    <TouchableOpacity>
                                        <Text style={styles.editButton} onPress ={this.toggleEditable}>Edit</Text>
                                    </TouchableOpacity> : null
                                }
                            </View>

                            <View style={styles.statsContainer}>
                                <Icon style={styles.statsIcon} name='clock' size={13} color='rgba(0,0,0, 0.5)' />
                                <TextInput style={styles.stats} 
                                    value ={this.state.readyInMinutes}  onChangeText={(readyInMinutes) => this.setState({readyInMinutes})}
                                    editable={this.state.editable}/>

                                <Icon style={styles.statsIcon} name='adult' size={13} color='rgba(0,0,0, 0.5)' />
                                <TextInput style={styles.stats} 
                                    value ={this.state.servings}  onChangeText={(servings) => this.setState({servings})}
                                    editable={this.state.editable}/>
                            </View>
                        </View>

                        <View style ={styles.macrosContainer}>
                            <View style ={styles.macrosColumn}> 
                                <TextInput style ={styles.macrosData}
                                    value={this.state.calories+''}  onChangeText={(calories) => this.setState({calories})}
                                    editable={this.state.editable}/>
                                <Text style ={styles.macrosLabel}>  CALORIES </Text>
                            </View>
                            <View style ={styles.macrosColumn}> 
                                <TextInput style ={styles.macrosData}
                                    value={this.state.protein+''}  onChangeText={(protein) => this.setState({protein})}
                                    editable={this.state.editable}/>                                
                                <Text style ={styles.macrosLabel}>  PROTEIN </Text>
                            </View>
                            <View style ={styles.macrosColumn}>
                                <TextInput style ={styles.macrosData}
                                    value={this.state.carbs+''}  onChangeText={(carbs) => this.setState({carbs})}
                                    editable={this.state.editable}/>   
                                <Text style ={styles.macrosLabel}>  CARBS </Text>
                            </View>
                            <View style={styles.macrosColumn}>
                                <TextInput style ={styles.macrosData}
                                    value={this.state.fats+''}  onChangeText={(fats) => this.setState({fats})}
                                    editable={this.state.editable}/>
                                <Text style ={styles.macrosLabel}> FATS </Text>
                            </View>
                        </View>

                        <View style ={styles.sectionContainer}>
                            < Text style={styles.sectionTitle}> Ingredients </Text>
                            {
                                // ingredientsList.map( (item, i) =>  
                                // ( <ListItem key={i} title={item.name} rightTitle={item.amount} 
                                //             titleStyle={styles.ingredientText} rightTitleStyle={styles.amountText} /> ))
                                this.state.extendedIngredients.map( (item, i) =>  
                                ( <ListItem key={i} title={item.name} rightTitle={item.amount} 
                                            titleStyle={styles.ingredientText} rightTitleStyle={styles.amountText} /> ))
                                    
                            }
                            <TouchableOpacity style={styles.compareButton}><Text style={styles.compareText}>Compare To Food Stock</Text></TouchableOpacity>
                        </View>

                        {/* contentContainerStyle={styles.numberContainer} rightContentContainerStyle={styles.instructionStepContainer} />  */}

                        <View style ={styles.sectionContainer}>
                            < Text style={styles.sectionTitle}> Instructions </Text>
                            {
                                this.state.instructions.map( (item, i) =>  
                                ( <ListItem key={i} title={item.instruction} leftIcon={<Badge value={i+1} 
                                    containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} /> } 
                                /> ))
                            }
                            <View style={{paddingBottom: 20}} />
                        </View>
                    </View>

                    <View style={styles.whitespaceBuffer} />
                    {
                        this.state.editable?            
                        <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                            <Text style={styles.saveChanges}>Save Changes</Text>
                        </TouchableOpacity> : null
                    }

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
    },

        
    editButton: {
        paddingTop: 12,
        paddingLeft: 15,
        paddingRight: 20,
        textDecorationLine: 'underline',
        fontSize: 15
        // color: 'black',
    },
    
    saveButton: {
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(204, 102, 102, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    saveChanges: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontweight: '600',
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
        width: '70%',
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
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: 'rgba(0,0,0,0.15)',
        borderTopColor: 'rgba(0,0,0,0.15)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    sectionTitle: {
        flex: 1,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 25,
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(0,0,0,1)',
    },

    /*-----------------------
       Ingredients
    -------------------------*/

    compareButton: {
        backgroundColor: 'rgba(188, 107, 107, 1)',
        marginTop: 25,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    
    compareText: {
        fontSize: 15,
        fontWeight: '500',
        width: '100%',
        color: 'rgba(255, 255, 255, 1)',
        textAlign: 'center',
    },

    ingredientText: {
        fontSize: 14,
        marginLeft: 20,
        marginBottom: -15,
        color: 'rgba(105,105,105,1)',
    },

    amountText: {
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