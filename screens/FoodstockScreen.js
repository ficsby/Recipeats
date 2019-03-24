import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { Styles } from '../styles/GlobalStyles';
import { ListItem } from 'react-native-elements';
import { addToFoodStock, logPurchaseDate} from '../utils/FoodListUtils';


// import Bar from 'react-native-bar-collapsible';

import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';


const inventoryList = [   // FOR TESTING PURPOSES
    {
        name: 'Rice',
        quantity: '4'
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
    state = {
        
    };

    render() {

        // inventoryList.map( (item, i) =>  
        //         ( addToFoodStock(firebase.auth().currentUser.uid, item.name, item.quantity)));

        inventoryList.forEach(item =>  
            addToFoodStock(firebase.auth().currentUser.uid, item.name, item.quantity));

        return(
        <View style ={Styles.sectionContainer}>
            <Text style={Styles.sectionTitle}> Inventory </Text>

            {
                inventoryList.map( (item, i) =>  
                ( <ListItem key={i} title={item.name} rightTitle={item.quantity} 
                    titleStyle={Styles.inventoryText} rightTitleStyle={Styles.quantityText} /> ))
                                    
            }
        </View>
        );
    }
}
