import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from "react-native";
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

import Button from "./Button";
import {
  modifyFoodStock,
  logPurchaseDate,
  getFoodList,
  removeFromFoodStock
} from "../../utils/FoodListUtils";
import * as firebase from "firebase";
import { Alert } from "react-native";
import FoodItemForm from './FoodItemForm';

function onPress(food) {
  alert(food.name + " was pressed.");
}

export default class FoodItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemModalVisible: false,
      name: this.props.name,
      parent: this.props.parent,
      quantity: this.props.quantity
      //purchaseDate: props.purchaseDate,
    };

    this.toggleItemModalVisible = this.toggleItemModalVisible.bind(this);
  }

  /**
   * Function to set whether the add item modal is visible or not
   * @param {*} visible - boolean value to set
   */
  toggleItemModalVisible() {
    this.setState({ itemModalVisible: !this.state.itemModalVisible });
  }

  onPressItem() {
    //alert(this.state.name + " was pressed.");
    this.toggleItemModalVisible;
  }

  onPressDelete() {
    const parent = this.state.parent;

    Alert.alert(
      "Warning",
      "Are you sure you want to delete " +
        this.state.name +
        " from your inventory?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            removeFromFoodStock(
              firebase.auth().currentUser.uid,
              this.state.name
            );

            //update the parent's foodlist to keep it synced with firebase
            console.log(parent.state.externalFoodList);
            parent.setState({
              externalFoodList: parent.state.externalFoodList.filter(
                foodItem => foodItem.name != this.state.name
              )
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.itemModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <FoodItemForm
            datePurchased={new Date()}
            metric=""
            name={this.state.name}
            price={null}
            quantity={this.state.quantity}
          />
          <TouchableHighlight onPress={this.toggleItemModalVisible}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
        </Modal>

        <Button
          key={this.props.index}
          noDefaultStyles={true}
          onPress={this.toggleItemModalVisible}
        >
          <View style={styles.foodItemContainer}>
            <Text style={styles.foodName}>{this.state.name}</Text>
            <Text style={styles.foodQuantity}>{this.state.quantity}</Text>
            <Button
              key={this.props.index}
              style={styles.foodButton}
              onPress={this.onPressDelete.bind(this, this.props)}
            >
              <Text>Delete</Text>
            </Button>
          </View>
          {/* <View style={styles.foodItemContainer}>
                    <Text style={styles.foodQuantity}>{this.state.quantity}</Text>
                </View> */}
        </Button>
      </View>
    );
  }
}

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
    marginLeft: wPercentage("0%")
  },

  foodQuantity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  foodButton: {
    flexDirection: "column",
    marginLeft: wPercentage("10%")
  }
});
