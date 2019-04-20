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
import AddFoodItemModal from "./AddFoodItemModal";

function onPress(food) {
  alert(food.name + " was pressed.");
}

export default class FoodItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemModalVisible: false,
      id: this.props.id,
	  name: this.props.name,
	  price: this.props.price,
      parent: this.props.parent,
      datePurchased: this.props.datePurchased,
      quantity: this.props.quantity,
	  unit: this.props.unit,
	  tableData: this.props.tableData
    };

    this.toggleIngrModalVisibility = this.toggleIngrModalVisibility.bind(this);
  }

  async componentDidMount() {
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
	console.log(this.state.tableData);
  }
  /**
   * Function to set whether the add item modal is visible or not
   * @param {*} visible - boolean value to set
   */
  toggleIngrModalVisibility() {
    this.setState({ itemModalVisible: !this.state.itemModalVisible });
  }

  onPressItem() {
    //alert(this.state.name + " was pressed.");
    this.toggleIngrModalVisibility;
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
			  this.state.name,
              this.state.id
            );

            //update the parent's foodlist to keep it synced with firebase
            // console.log(parent.state.externalFoodList);
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
		  <AddFoodItemModal
			  	isModalVisible={this.state.itemModalVisible}
				title={"Edit Ingredient"}
				showPriceInput = {true}
				showDatePicker = {true}
                datePurchased={this.state.datePurchased}
                id={this.state.id}
                name= {this.state.name}
                parent={this}
                price={this.state.price}
                quantity={this.state.quantity}
				unit={this.state.unit}
				tableData = {this.state.tableData}
            />
        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.itemModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <FoodItemForm
            datePurchased={this.state.datePurchased}
            id={this.state.id}
            name={this.state.name}
            parent={this}
            price={null}
            quantity={this.state.quantity}
            unit=""
          />
          <TouchableHighlight onPress={this.toggleIngrModalVisibility}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
        </Modal> */}

        <Button
          key={this.props.index}
          noDefaultStyles={true}
          onPress={() => this.toggleIngrModalVisibility()}
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
