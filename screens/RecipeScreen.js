import React from 'react';
import { StyleSheet, Button, Image, ImageBackground, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { SearchBar, ListItem, Badge } from 'react-native-elements';
import Bar from 'react-native-bar-collapsible';
import { Font, AppLoading } from 'expo';
//import * as firebase from 'firebase';

//import logo from './../../assets/images/logo_transparent.png';
//import { reset } from 'expo/build/AR';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');

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
            bookmarked: false,
            // search: '',
        };
        this.toggleBookmark = this.toggleBookmark.bind(this);
    };

    toggleBookmark() {
        this.setState({  bookmarked: !this.state.bookmarked  });
    };

    renderBookmark() {
        bookmarkStatus = this.state.bookmarked? "bookmark" : "bookmark-empty";
        return (
            <Icon name={bookmarkStatus} size={28} color='rgba(175,76,99,1)'
                  style={{paddingTop: 6}} />
        );
    };

    // updateSearch = search => {
    //     this.setState({ search });
    // };
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
    };

    onAccountIconPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "EditAccount" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    };

    render() {

        const { search } = this.state;

        return (
            <View style={{flex: 1}}> 

                <View style={styles.topContainer}>

                    <View style={styles.row}>
                        {/* Side bar navigation icon */}
                        <TouchableOpacity style={{height: 80}}>
                            <Icon name='menu' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '20%'}} />
                        </TouchableOpacity>

                        {/* User account icon */}
                        <TouchableOpacity style={{height: 80}} onPress ={this.onAccountIconPress}>
                            <Icon name='user' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '75%'}} />
                        </TouchableOpacity>
                    </View>

                    <SearchBar placeholder="Search recipes, ingredients..."
                               lightTheme={true}
                               round={true}
                               containerStyle={styles.searchContainer}
                               inputContainerStyle={styles.searchInputContainer}
                               inputStyle={styles.searchInput}
                               onChangeText={this.updateSearch}
                               value={search} />
                </View>
                
                <ScrollView style={styles.recipeContainer}> 

                    {/* <ImageBackground source={require('./../assets/images/test_photo.jpg')} /> */}
                    <ImageBackground source={require('./../assets/images/test_photo.jpg')} style={styles.image}>
                    </ImageBackground>
                    <View style={styles.contents}>

                        <View style={styles.titleContainer}>
                            <View style={styles.row}>
                                <Text style={styles.title}> Some Recipe Title </Text>
                                
                                <TouchableOpacity  onPress={this.toggleBookmark} >
                                    {this.renderBookmark() }
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

                        <Bar title='Ingredients' style={styles.collapsibleBar} titleStyle={styles.collapsibleTitle} tintColor='rgba(63, 52, 50, 0.75)'
                             collapsible={true} showOnStart={true} iconSize={15} >
                            <View style ={styles.ingredientsContainer}>
                                {
                                    ingredientsList.map( (item, i) =>  
                                    ( <ListItem key={i} title={item.name} rightTitle={item.quantity} 
                                                titleStyle={styles.ingredientText} rightTitleStyle={styles.quantityText} /> ))
                                }
                            </View>
                        </Bar>

                        {/* contentContainerStyle={styles.numberContainer} rightContentContainerStyle={styles.instructionStepContainer} />  */}

                        <Bar title='Instructions' style={styles.collapsibleBar} titleStyle={styles.collapsibleTitle} tintColor='rgba(63, 52, 50, 0.75)'
                             collapsible={true} showOnStart={true} iconSize={15} >
                            <View style ={styles.instructionsContainer}>
                                {
                                    instructionsList.map( (item, i) =>  
                                    ( <ListItem key={i} title={item.instruction} leftIcon={<Badge value={i+1} 
                                       containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} /> } 
                                                /> ))
                                }
                            </View>
                        </Bar>

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
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
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
        height: '15%',
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(246, 238, 238, 1)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },

    searchContainer: {
        height: 45,
        width: '90%',
        backgroundColor: 'white',
    },

    searchInputContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: -5,
    },

    searchInput: {
        fontSize: 15,
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
        fontSize: 28,
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

    descriptionContainer: {
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },

    description: {
        marginTop: 8,
        marginBottom: 15,
        marginLeft: 17,
        marginRight: 17,
        fontSize: 14,
        color: 'rgba(0,0,0, 0.8)',
    },

    ingredientsContainer: {
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

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
    
    instructionsContainer: {
        marginBottom: 100,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

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
        marginLeft: 20,
        marginRight: 15,
    },

    numberBadge: {
        backgroundColor: 'rgba(68, 72, 76, 0.82)',
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
        bottom: 10,
    },

    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(246, 238, 238, 1)',
        borderTopColor: 'rgba(225, 218, 218, 0.7)',
        borderTopWidth: 2.1,
    },
    
});