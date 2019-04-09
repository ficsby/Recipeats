import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

import Button from './Button';
import { modifyFoodStock, logPurchaseDate, getFoodList, removeFromFoodStock } from '../../utils/FoodListUtils';
import * as firebase from 'firebase';
import {Alert} from 'react-native';

function onPress(food){
    alert(food.name + " was pressed.");
}

export default class FoodItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            quantity: props.quantity,
            //purchaseDate: props.purchaseDate,
        }
    }
    
    onPressItem() {
        alert(this.state.name + " was pressed.");
    }

    onPressEdit() {
        alert(this.state.name + " edit button was pressed.");
    }

    onPressDelete() {
        //alert(this.state.name + " delete button was pressed.");
        //removeFromFoodStock(firebase.auth().currentUser.uid, this.state.name);
        Alert.alert(
        'Warning',
        'Are you sure you want to delete ' + this.state.name + ' from your inventory?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => removeFromFoodStock(firebase.auth().currentUser.uid, this.state.name),
          },
        ],
        {cancelable: false},)
        
    }

    render() {
        return(
            <Button key = { this.props.index } noDefaultStyles = {true} onPress = { this.onPressItem.bind(this, this.props) } >
                <View style={styles.foodItemContainer}>
                    <Text style={styles.foodName}>{this.state.name}</Text>
                    <Text style={styles.foodQuantity}>{this.state.quantity}</Text>
                    <Button key={this.props.index} style={styles.foodButton} onPress = {this.onPressDelete.bind(this, this.props)}><Text>Delete</Text></Button>
                </View>
                {/* <View style={styles.foodItemContainer}>
                    <Text style={styles.foodQuantity}>{this.state.quantity}</Text>
                </View> */}
                

            </Button>
        );
    }
};

const styles = StyleSheet.create({
  foodItemContainer: {
    flex: 1,
    flexDirection: "row",
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "rgba(244, 238, 238, 0.9)",
    marginBottom: 13
  },

  foodName: {
    flexDirection: "column",
    marginLeft: wPercentage('0%'),
  },

  foodQuantity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  foodButton: {
    flexDirection: "column",
    marginLeft: wPercentage('10%'),
  },
});