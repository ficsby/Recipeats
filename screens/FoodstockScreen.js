import React from 'react';
import { StyleSheet, Button, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { Styles } from '../styles/GlobalStyles';
import { ListItem } from 'react-native-elements';
import { modifyFoodStock, logPurchaseDate, getFoodList, removeFromFoodStock} from '../utils/FoodListUtils';
import KeyboardShift from '../styles/KeyboardShift.js';

// import Bar from 'react-native-bar-collapsible';

import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';


const inventoryList = [   // FOR TESTING PURPOSES
    {
        name: 'Rice',
        quantity: '5'
    },
    {
        name: 'Peas',
        quantity: '1'
    },
    {
        name: 'Carrots',
        quantity: '1'
    },
    {
        name: 'Corn',
        quantity: '4'
    },
    {
        name: 'Garlic',
        quantity: '3'
    },
    {
        name: 'Vegetable Oil',
        quantity: '2'
    },
];


export default class FoodstockScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            externalFoodlist: [],
            editable: false,
            itemName: '',
            itemQuantity: '',
        };
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
        this.toggleEditable = this.toggleEditable.bind(this);
        this.onDeletePress = this.onDeletePress.bind(this);
    }

//  Toggles whether the information is editable by the user.
    //  User is only able to edit after clicking on the edit button
    toggleEditable() {
        this.setState({
            editable: !this.state.editable
        });
        
        this.state.editable?  Alert.alert("Not editable now") : Alert.alert("Values should be editable now.");
    }

    componentDidMount() {
        this._ismounted = true;
        foodlist = []

        // Returns a promise of the user's value
        retrieveData = () => {
            ref = getFoodList(firebase.auth().currentUser.uid);
            return ref.once("value");
        }

        // Snapshot is the depiction of the user's current data
        retrieveData().then( (snapshot) => {
            if(this._ismounted)
            {
                foodlistSnapshot = snapshot.val();

                for (var key in foodlistSnapshot) {
                    if (foodlistSnapshot.hasOwnProperty(key)) {
                        foodlist.push( {name: key, quantity: foodlistSnapshot[key]} );
                    }
                }
                this.setState( {
                    externalFoodlist: foodlist
                })
            }
        })
    }

    componentWillUnmount () {
        this._ismounted = false; // After components is unmounted reset boolean
    }

    onSaveChangesPress = () => {
        //var user = firebase.auth().currentUser;
        //this.writeUserData(user.uid);
        modifyFoodStock(firebase.auth().currentUser.uid, this.state.itemName, this.state.itemQuantity);
        Alert.alert("Your changes has been updated..");
    }

    onDeletePress = () => {
        removeFromFoodStock(firebase.auth().currentUser.uid, 'Carrots');
    }

    render() {
        
        //Push data to firebase
        // inventoryList.forEach(item =>  
        //     modifyFoodStock(firebase.auth().currentUser.uid, item.name, item.quantity));

        return(
        
            <KeyboardShift>
            {() => (
                <ScrollView>
                    <View style ={Styles.sectionContainer}>
                        <Text style={Styles.sectionTitle}> Inventory </Text>

                        {
                            //Fetch and display data from firebase
                            this.state.externalFoodlist && this.state.externalFoodlist.map( (item, i) =>  
                            ( <ListItem key={i} title={item.name} rightTitle={item.quantity} 
                                titleStyle={Styles.inventoryText} rightTitleStyle={Styles.quantityText} /> ))
                        }
                        

                        {/* Edit Button (When pressed, makes the information content editable) */}
                        <TouchableOpacity>
                            <Text style={Styles.editButton} onPress ={this.toggleEditable}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={Styles.deleteButton} onPress ={this.onDeletePress}> 
                            <Text style={Styles.saveChanges}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={Styles.saveButton} onPress ={this.onSaveChangesPress}> 
                            <Text style={Styles.saveChanges}>Save Changes</Text>
                        </TouchableOpacity>


                        <View style={Styles.dataRow}>
                        <Text style={Styles.inputLabel}>Name</Text>
                        <TextInput style={Styles.inputData} 
                                value ={this.state.itemName}  onChangeText={(itemName) => this.setState({itemName})}
                                editable={this.state.editable}/>
                        </View>

                        <View style={Styles.dataRow}>
                        <Text style={Styles.inputLabel}>Quantity</Text>
                        <TextInput style={Styles.inputData} 
                                value ={this.state.itemQuantity}  onChangeText={(itemQuantity) => this.setState({itemQuantity})}
                                editable={this.state.editable}/>
                        </View>

                    </View>

                </ScrollView>
            )}
        </KeyboardShift>
        );
    }
}
