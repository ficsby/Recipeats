import React, { Component } from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

export default class FoodstockScreen extends React.Component {
    state = {
        
    };

    render() {
        <View style ={styles.sectionContainer}>
            < Text style={styles.sectionTitle}> Ingredients </Text>

            {
                ingredientsList.map( (item, i) =>  
                ( <ListItem key={i} title={item.name} rightTitle={item.quantity} 
                    titleStyle={styles.ingredientText} rightTitleStyle={styles.quantityText} /> ))
                                    
            }
                <TouchableOpacity  onPress={this.compareFoodLists} style={{alignItems: 'flex-end', marginRight: 15, paddingTop: 20}}>
                    <Icon name='checklist-2' size={26} color='rgba(0,0,0,0.6)' />
                </TouchableOpacity>
        </View>
    }
}