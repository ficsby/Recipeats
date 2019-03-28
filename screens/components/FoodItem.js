import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";

import Button from './Button';

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

    render() {
        return(
            <Button key = { this.props.index } noDefaultStyles = {true} onPress = { this.onPressItem.bind(this, this.props) } >
                <View style={styles.foodItem}>
                    <Text>Temporary text</Text>
                </View>
            </Button>
        );
    }
};

const styles = StyleSheet.create({
  foodItem: {
    flex: 1,
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "rgba(244, 238, 238, 0.9)",
    marginBottom: 13
  }
});