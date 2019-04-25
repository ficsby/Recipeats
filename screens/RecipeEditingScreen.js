import React from 'react';
import { PermissionsAndroid , CameraRoll, TouchableHighight, Button, FlatList, StyleSheet, Image, ImageBackground, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert, Modal } from 'react-native';
import { StackActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem, Badge, Divider} from 'react-native-elements';
// import DialogInput from 'react-native-dialog-input';
import FlatListItem from './components/FlatListItem';
import AddInstructionModal from './components/AddInstructionModal';
import AddFoodItemModal from "./components/AddFoodItemModal";

import { Font, AppLoading } from 'expo';
import * as firebase from 'firebase';
import ComparisonModal from './components/ComparisonModal';
import {getFoodList} from './../utils/FoodListUtils';

import {
    widthPercentageToDP as wPercentage,
    heightPercentageToDP as hPercentage
  } from "react-native-responsive-screen";

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const fetch = require('node-fetch');

import { ImagePicker } from 'expo';
import LoadingScreen from './LoadingScreen';
import DialogInput from 'react-native-dialog-input';

// import apiUtils from '../api/apiUtils.js';

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/GlobalStyles.js');
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

class RecipeEditingScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            // isLoading: true,
            editable: true,
            query: '',
            recipes: [],
            deletedRowKey: null,
            bookmarked: this.props.parent.state.bookmarked,
            liked: this.props.parent.state.liked,
            comparisonModalVisible: false,

            id: this.props.parent.state.id,
            title: this.props.parent.state.title,
            servings: this.props.parent.state.servings,
            readyInMinutes: this.props.parent.state.readyInMinutes,
            calories: this.props.parent.state.calories,
            protein: this.props.parent.state.protein,
            carbs: this.props.parent.state.carbs,
            fats: this.props.parent.state.fats,
            sourceUrl: this.props.parent.state.sourceUrl,
            creditText:this.props.parent.state.creditText,
            sourceName: this.props.parent.state.sourceName,
            image: this.props.parent.state.image,
            nutrients : null,

            tempIngredients: this.props.parent.state.extendedIngredients,
            tempInstructions: this.props.parent.state.instructions,
            nutritionalTags: this.props.parent.state.nutritionalTags,
            
            photo: null,

            ingredientModalVisible: false,
            instructionModalVisible: false,
            imageModalVisible: false
        
        };
        this.toggleComparisonModal = this.toggleComparisonModal.bind(this);
        this.onPressAddIngredient = this.onPressAddIngredient.bind(this);
        this.onPressAddInstruction= this.onPressAddInstruction.bind(this);
        this.renderIngredientsList = this.renderIngredientsList.bind(this);
        this.renderInstructionsList = this.renderInstructionsList.bind(this);
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
        this.onCancelEditChanges = this.onCancelEditChanges.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleHeart = this.toggleHeart.bind(this);
        this.toggleIngrModalVisibility = this.toggleIngrModalVisibility.bind(this);
        this.toggleInstrModalVisibility = this.toggleInstrModalVisibility.bind(this);
        this.renderDefaultBackgroundImage = this.renderDefaultBackgroundImage.bind(this);
        this.renderChosenBackgroundImage = this.renderChosenBackgroundImage.bind(this);
        this._pickImage = this._pickImage.bind(this);
    };

    async componentDidMount() {
        this._ismounted = true;
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        if(this.state.id > 0){ this.setState({id: -this.state.id})}
    };

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
    }

    toggleBookmark() {
        this.setState({  bookmarked: !this.state.bookmarked  });
    };

    toggleComparisonModal() {
        this.setState({comparisonModalVisible: !this.state.comparisonModalVisible});
    }

    // Toggles the like state when the "Heart" icon is tapped
    toggleHeart() {
        this.setState({  liked: !this.state.liked });
    };

    toggleIngrModalVisibility() {
		this.setState({
			ingredientModalVisible : !this.state.ingredientModalVisible
		})
    }
    
    toggleInstrModalVisibility() {
		this.setState({
			instructionModalVisible : !this.state.instructionModalVisible
		})
    }

    getFoodStock() {
      foodList = [];

      // Returns a promise of the user's value
      retrieveData = () => {
        ref = getFoodList(firebase.auth().currentUser.uid);
        return ref.once("value");
      };
  
      // Snapshot is the depiction of the user's current data
      retrieveData().then(snapshot => {
        foodListSnapshot = snapshot.val();
  
        for (var key in foodListSnapshot) {
          if (foodListSnapshot.hasOwnProperty(key)) {
            foodList.push(foodListSnapshot[key]);
          }
        }
        
      });

      return foodList;
    }

    // Renders the icon according to its current state
    renderIcon(iconType) {
        if(iconType == "bookmark")
        {
            bookmarkStatus = this.state.bookmarked? "bookmark" : "bookmark-empty";
            return (
                  <Icon name={bookmarkStatus} size={28} color='rgba(255,255,255,1)' style={styles.overlayButtons} />
            );
        }

        if(iconType == "heart")
        {
            heartStatus = this.state.liked? "heart" : "heart-empty";
            return (
                <Icon name={heartStatus} size={28} color='rgba(255,255,255,1)' style={styles.overlayButtons} />
            );
        }
    };

    onPressAddIngredient(){
        this.setState({ingredientModalVisible: true});
    }

    onPressAddInstruction(){
        this.setState({instructionModalVisible: true});
    }

    renderIngredientsList(){
        return (
            <FlatList data={this.state.tempIngredients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => 
              <FlatListItem parentFlatList={this} flatListData={this.state.tempIngredients} sectionId={1} rowId={index} 
                    title={item.name} rightTitle={item.amount + " " + item.unit} titleStyle={styles.ingredientText} rightTitleStyle={styles.amountText} rightIcon={<Icon name='left-open' size={17} color={'grey'} style={styles.swipeIndicator}/>}/>
            }/>
        );
    };
    
    renderInstructionsList(){
        return(
            <FlatList data={this.state.tempInstructions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => 
              <FlatListItem parentFlatList={this} flatListData={this.state.tempInstructions} sectionId={2} rowId={index} title={item.step} 
                    leftIcon={<Badge value={index+1} containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} rightIcon={<Icon name='left-open' size={17} color={'grey'} style={styles.swipeIndicator}/>} />} 
               />
            }/>
        );
    };

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
    
    onSaveChangesPress() {
        // UPDATE FIREBASE WITH THE NEW RECIPE CHANGES HERE
        ref = 'customRecipes/' + firebase.auth().currentUser.uid + '/' + this.state.title + '_' + this.state.id;
        
        firebase.database().ref(ref).set({
            extendedIngredients: (this.state.tempIngredients)? this.state.tempIngredients : [],
            instructions: (this.state.tempInstructions)? this.state.tempInstructions : [],
        });

        firebase.database().ref(ref).update({
            id: this.state.id,
            title: this.state.title,
            servings: this.state.servings,
            readyInMinutes: this.state.readyInMinutes,

            calories: 155,
            protein: 3,
            carbs: 8,
            fats: 16,
            
            nutrients : this.state.nutrients,
            sourceUrl: this.state.sourceUrl,
            creditText: this.state.creditText,
            sourceName: this.state.sourceName,
            image: (this.state.image)? this.state.image : '',
        })

        this.props.parent.setState({
            title: this.state.title,
            servings:  this.state.servings,
            readyInMinutes:  this.state.readyInMinutes,

            calories:  this.state.calories,
            protein:  this.state.protein,
            carbs:  this.state.carbs,
            fats:  this.state.fats,
            image: this.state.image,

            extendedIngredients:  this.state.tempIngredients,
            instructions: this.state.tempInstructions,
            nutritionalTags: this.state.nutritionalTags
		})
		
        Alert.alert("Your changes have been saved.");
        this.props.parent.toggleEditable();
    }

    onCancelEditChanges() {
        this.props.parent.toggleEditable();
    }

    renderDefaultBackgroundImage() {
        return (
            <ImageBackground source={require('./../assets/images/default_image.png')} style={styles.image}>
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
        );
    };

    renderChosenBackgroundImage(){
        return(
            <ImageBackground source={{uri:this.state.image}} style={styles.image}>
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
        );
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
    });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };


    render() {
        return ( 
            <View> 
                {/*---------------------------------------------------------------------------------
                   Recipe Page Contents 
                ------------------------------------------------------------------------------------*/}
                
                <ScrollView style={styles.recipeContainer}> 
                    {/* Comparison Modal */}
                    <Modal
                      animationType="slide"
                      transparent={false}
                      visible={this.state.comparisonModalVisible}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      }}
                    >
                      <ComparisonModal
                        parent={this}
                        foodstock={this.getFoodStock()}
                        recipeIngredients={this.state.tempIngredients}
                      />
                    </Modal>
                    
                    <TouchableOpacity onPress={this._pickImage}>
                    {
                        (this.state.image)? this.renderChosenBackgroundImage() : this.renderDefaultBackgroundImage()
                    }
                    </TouchableOpacity>

                    <View style={styles.contents}>

                        <View style={styles.recipeTitleContainer}>
                            <View style={styles.row}>
                                <TextInput multiline style={styles.recipeTitle} 
                                    value ={this.state.title}  onChangeText={(title) => this.setState({title})}
                                    editable={this.state.editable}/>
                            </View>

                            <View style={styles.statsContainer}>
                                <Icon style={styles.statsIcon} name='clock' size={13} color='rgba(0,0,0, 0.5)' />
                                <TextInput style={styles.stats} 
                                    value ={this.state.readyInMinutes.toString()}  onChangeText={(readyInMinutes) => this.setState({readyInMinutes})}
                                    editable={this.state.editable}/>
                                <Text style={{fontSize: 18, marginTop: wPercentage('0.35%'), marginLeft: wPercentage('1.6%'), marginRight: wPercentage('2.2%')}}>minutes</Text>


                                <Icon style={styles.statsIcon} name='adult' size={13} color='rgba(0,0,0, 0.5)' />
                                <TextInput style={styles.stats} 
                                    value ={this.state.servings.toString()}  onChangeText={(servings) => this.setState({servings})}
                                    editable={this.state.editable}/>
                                <Text style={{fontSize: 18,  marginTop:hPercentage('0.35%'), marginLeft: wPercentage('1.6%'), marginRight: wPercentage('2%')}}>servings</Text>
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
                                
						{/* Shows the add ingredient modal if ingredientModalVisible is true (i.e when the user clicks '+' icon to add an ingredient */}
						
						<AddFoodItemModal
							isModalVisible={this.state.ingredientModalVisible}
							title={"Add Ingredient to Recipe"}
							showPriceInput = {false}
							showDatePicker = {false}
                            datePurchased={new Date()}
                            sectionId={1}
							id={null}
							name=""
							parent={this}
							price={null}
							amount={null}
							unit=""
						/>

                        {/* Shows the add ingredient modal if ingredientModalVisible is true (i.e when the user clicks '+' icon to add an ingredient */}
                        <AddInstructionModal 
                            isModalVisible={this.state.instructionModalVisible}
                            parent={this}
                            instructionData={this.state.tempInstructions}
                            title={"Add Instruction to Recipe"}
                        />
        
                        <View style ={styles.sectionContainer}>
                            <View style={styles.row}>
                                <Text style={styles.sectionTitle}>Ingredients</Text>

                                    <TouchableOpacity onPress ={this.onPressAddIngredient}>
                                        <Icon style={styles.addIcon} name='plus' size={18} color='rgba(0,0,0, 0.65)' />
                                    </TouchableOpacity>

                            </View>
                            {
                                (this.state.tempIngredients && this.state.tempIngredients.length > 0)?
                                this.renderIngredientsList() : <Text style={styles.emptyListText}>There are no ingredients to show.</Text>
                            }
                            <TouchableOpacity 
                                style={styles.compareButton} 
                                onPress={this.toggleComparisonModal}
                            >
                                <Text style={styles.compareText}>Compare To Food Stock</Text>
                            </TouchableOpacity>
                        </View>

                        {/* contentContainerStyle={styles.numberContainer} rightContentContainerStyle={styles.instructionStepContainer} />  */}

                        <View style ={styles.sectionContainer}>
                            <View style={styles.row}>
                                <Text style={styles.sectionTitle}>Instructions</Text>
                                
                                    <TouchableOpacity   onPress ={this.onPressAddInstruction}>
                                        <Icon style={styles.addIcon} name='plus' size={18} color='rgba(0,0,0, 0.65)' />
                                    </TouchableOpacity>
                            </View>
                            {
                               (this.state.tempInstructions && this.state.tempInstructions.length > 0)?
                               this.renderInstructionsList() : <Text style={styles.emptyListText}>There are no instructions to show.</Text>
                            }
                            <View style={{paddingBottom: hPercentage('5%')}} />
                        </View>
                    </View>
                    
                    <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                        <Text style={styles.saveChanges}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress ={this.onCancelEditChanges}> 
                        <Text style={styles.cancelChanges}>Cancel Edit</Text>
                    </TouchableOpacity>

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

    divider: {
        backgroundColor: 'blue' 
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
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('1%'),
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
        marginTop: hPercentage('-1%'),
        marginBottom: hPercentage('1%'),
        marginLeft: wPercentage('4%'),
        marginRight: wPercentage('4%'),
        paddingTop: hPercentage('1%'),
        paddingBottom: hPercentage('1%'),
        backgroundColor: 'rgba(204, 102, 102, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    saveChanges: {
        width: '100%',
        textAlign: 'center',
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: '600',
    },

    cancelButton: {
        // marginTop: hPercentage('3%'),
        marginBottom: hPercentage('3%'),
        marginLeft: wPercentage('4%'),
        marginRight: wPercentage('4%'),
        paddingTop: hPercentage('1%'),
        paddingBottom: hPercentage('1%'),
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelChanges: {
        width: '100%',
        textAlign: 'center',
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: '600',
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
        paddingTop: hPercentage('1%'),
        paddingBottom: hPercentage('3%'),
        paddingRight: wPercentage('1%'),
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    overlayButtons: {
        paddingTop: hPercentage('0.5%'), 
        paddingRight: wPercentage('5%'),
    },

    recipeContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },

    image: {
        //position: 'relative',
        width: '100%',
        height: 300,
    },

    // @CT
    recipeTitleContainer: {
        marginTop: hPercentage('-4%'),
        paddingTop: hPercentage('2%'),
        backgroundColor: 'rgba(255,255,255,1)',
    },

    //@CT
    recipeTitle: {
        width: hPercentage('43%'),
        maxHeight: hPercentage('5%'),
        marginLeft: wPercentage('7%'),
        marginRight: wPercentage('8%'),
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
        paddingTop: hPercentage('0.2%'),
        paddingBottom: hPercentage('0.2%'),
        paddingRight: wPercentage('2%'),
        paddingLeft: wPercentage('2%'),
        borderColor: 'rgba(193, 201, 200, 1)',
        borderWidth: 1,
    },

    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('2%'), 
        marginLeft: wPercentage('3%'),
    },


    stats: {
        fontSize: 18,
        color: 'rgba(0,0,0, 0.8)',
        marginLeft: wPercentage('3%'),
        paddingTop: hPercentage('0.2%'),
        paddingBottom: hPercentage('0.2%'),
        paddingRight: wPercentage('1.3%'),
        paddingLeft: wPercentage('1.3%'),
        borderColor: 'rgba(193, 201, 200, 1)',
        borderWidth: 1,
    },
    
    statsIcon: {
        marginTop: wPercentage('1%'),
        marginLeft: wPercentage('5%'),
        fontSize: 18,
        color: 'rgba(0,0,0, 0.5)',
    },


    /*------------------------------------------------------------------------
        Macros Styles
    ------------------------------------------------------------------------*/

      macrosContainer: {
        paddingTop: hPercentage('2%'),
        marginBottom: hPercentage('2%'),
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
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 5,
        paddingLeft: 5,
        borderColor: 'rgba(193, 201, 200, 1)',
        borderWidth: 1,
    },

    
    /*------------------------------------------------------------------------
        Recipes Styles
    ------------------------------------------------------------------------*/
    
    sectionContainer: {
        marginBottom: hPercentage('3%'),
        paddingTop: hPercentage('1%'),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: 'rgba(0,0,0,0.15)',
        borderTopColor: 'rgba(0,0,0,0.15)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    sectionTitle: {
        flex: 1,
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('2%'),
        marginLeft: wPercentage('7%'), //
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(0,0,0,1)',
    },

    emptyListText: {
        marginLeft: wPercentage('7%'),
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('2%'),
    },

    swipeIndicator: {
        paddingRight: wPercentage('4%'),
        paddingLeft: wPercentage('1.5%')
    },
    /*------------------------------------------------------------------------
        Ingredients Styles
    ------------------------------------------------------------------------*/
    addIcon: {
        paddingTop: hPercentage('2%'), //10
        paddingRight: wPercentage('7%'), //30
    },
    
    compareButton: {
        marginTop: hPercentage('3%'),
        marginBottom: hPercentage('2%'),
        marginRight: wPercentage('5%'),
        marginLeft: wPercentage('5%'),
    },
    
    compareText: {
        fontSize: 15,
        fontWeight: '500',
        width: '100%',
        color: 'rgba(58, 170, 170, 1)',
        textAlign: 'center',
    },

    ingredientText: {
        fontSize: 14,
        marginLeft: wPercentage('4%'),
        marginBottom: -15,
        color: 'rgba(105,105,105,1)',
    },

    amountText: {
        width: '100%',
        fontStyle: 'italic',
        marginRight: wPercentage('10%'), //20
        marginBottom: -15,
    },


    /*------------------------------------------------------------------------
        Instructions Styles
    ------------------------------------------------------------------------*/

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
        marginLeft: wPercentage('7%'), 
        marginRight:  wPercentage('8%'),
    },

    numberBadge: {
        backgroundColor: 'rgba(68, 72, 76, 0.6)',
        borderRadius: 100,
        width: wPercentage('5%'),
        height: hPercentage('5%'),
    },

    instructionNumber: {
        width: '100%',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default RecipeEditingScreen;