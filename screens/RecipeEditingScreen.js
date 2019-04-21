import React from 'react';
import { FlatList, StyleSheet, Image, ImageBackground, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert, Modal } from 'react-native';
import { StackActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem, Badge, Divider} from 'react-native-elements';
// import DialogInput from 'react-native-dialog-input';
import FlatListItem from './components/FlatListItem';
import AddInstructionModal from './components/AddInstructionModal';
import AddFoodItemModal from "./components/AddFoodItemModal";

import { Font, AppLoading } from 'expo';
import * as firebase from 'firebase';
// import NavigationService from '../navigation/NavigationService.js';
import ComparisonModal from './components/ComparisonModal';
import {getFoodList} from './../utils/FoodListUtils';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const fetch = require('node-fetch');

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
            imageURL: this.props.parent.state.imageURL,
            ingredientModalVisible: false,
            instructionModalVisible: false,
            tempIngredients: this.props.parent.state.extendedIngredients,
            tempInstructions: this.props.parent.state.instructions,
            nutritionalTags: this.props.parent.state.nutritionalTags
        
        };
        this.toggleComparisonModal = this.toggleComparisonModal.bind(this);
        this.onPressAddIngredient = this.onPressAddIngredient.bind(this);
        this.onPressAddInstruction= this.onPressAddInstruction.bind(this);
        this.renderIngredientsList = this.renderIngredientsList.bind(this);
        this.renderInstructionsList = this.renderInstructionsList.bind(this);
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleHeart = this.toggleHeart.bind(this);
    };

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
            // (this.state.editable)?
            <FlatList data={this.state.tempIngredients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => 
              <FlatListItem parentFlatList={this} flatListData={this.state.tempIngredients} sectionId={1} rowId={index} 
                    title={item.name} rightTitle={item.amount + " " + item.unit} titleStyle={styles.ingredientText} rightTitleStyle={styles.amountText}/>
            }/>
        //     :
        //     this.state.tempIngredients.map( (item, index) =>  
        //     ( 
        //       <View>
        //         <ListItem key={index} title={item.name} rightTitle={item.amount} titleStyle={styles.ingredientText} rightTitleStyle={styles.amountText} />
        //         <Divider />
        //       </View>
        //     )) 
        );
    };
    
    renderInstructionsList(){
        return(
            // (this.state.editable)?
            <FlatList data={this.state.tempInstructions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => 
              <FlatListItem parentFlatList={this} flatListData={this.state.tempInstructions} sectionId={2} rowId={index} title={item.instruction} 
                  leftIcon={<Badge value={index+1} containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} />} 
               />
            }/>
            // :
            // this.state.tempInstructions.map( (item, index) =>  
            // ( 
            //     <View>
            //         <ListItem key={index} title={item.instruction} leftIcon={<Badge value={index+1} containerStyle={styles.numberContainer} badgeStyle={styles.numberBadge} textStyle={styles.instructionNumber} /> } /> 
            //         <Divider />
            //     </View>
            // ))
        );
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
    
    onSaveChangesPress() {
        this.props.parent.setState({
            title: this.state.title,
            servings:  this.state.servings,
            readyInMinutes:  this.state.readyInMinutes,

            calories:  this.state.calories,
            protein:  this.state.protein,
            carbs:  this.state.carbs,
            fats:  this.state.fats,
            imageURL: this.state.imageURL,

            extendedIngredients:  this.state.tempIngredients,
            instructions: this.state.tempInstructions,
            nutritionalTags: this.state.nutritionalTags
        })
        Alert.alert("Your changes have been saved.");
        this.props.parent.toggleEditable();
    }

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
                                <TextInput multiline style={styles.title} 
                                    value ={this.state.title}  onChangeText={(title) => this.setState({title})}
                                    editable={this.state.editable}/>

                                {/* <Text style={styles.title}>{this.state.title}</Text> */}
                                {/* {
                                    !(this.state.editable)? 
                                    <TouchableOpacity>
                                        <Text style={styles.editButton} onPress ={this.toggleEditable}>Edit</Text>
                                    </TouchableOpacity> : null
                                } */}
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
                        {/* <AddItemModal isModalVisible={this.state.ingredientModalVisible}
                            title={"Add Ingredient"}
                            message1={"Name:"} message2={"Amount:"}
                            suggestion1={"Example: mushrooms"} suggestion2={"Example: 1/2 cups"}
                            submitInput={ (inputText) => {this.sendInput(inputText)} }
                            closeDialog={ () => {this.showDialog(false)}}/> */}

                        {/* Shows the add ingredient modal if ingredientModalVisible is true (i.e when the user clicks '+' icon to add an ingredient */}
                        <AddInstructionModal 
                            isModalVisible={this.state.instructionModalVisible}
                            parent={this}
                            title={"Add Instruction"}
                            message1={"Instruction:"} message2={"Step #:"}
                            suggestion1={"Ex: Combine the eggs with sugar"} suggestion2={""}
                            closeDialog={ () => {this.showDialog(false)}}
                        />
        
                        <View style ={styles.sectionContainer}>
                            <View style={styles.row}>
                                <Text style={styles.sectionTitle}>Ingredients</Text>

                                    <TouchableOpacity onPress ={this.onPressAddIngredient}>
                                        <Icon style={styles.addIcon} name='plus' size={18} color='rgba(0,0,0, 0.65)' />
                                    </TouchableOpacity>

                            </View>
                            {
                                this.renderIngredientsList()
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
                               this.renderInstructionsList()
                            }
                            <View style={{paddingBottom: 20}} />
                        </View>
                    </View>

                    <View style={styles.whitespaceBuffer} />
                    
                        <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                            <Text style={styles.saveChanges}>Save Changes</Text>
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
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
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
        maxHeight: 80,
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
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 30,
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(0,0,0,1)',
    },

    /*-----------------------
       Ingredients
    -------------------------*/
    addIcon: {
        // backgroundColor: 'rgba(188, 107, 107, 1)',
        // marginTop: 25,
        paddingTop: 10,
        // paddingBottom: 10,
        paddingRight: 30,
    },
    
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

export default RecipeEditingScreen;