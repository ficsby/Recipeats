import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { Font, AppLoading } from "expo";
import { ListItem } from "react-native-elements";
import KeyboardShift from "../styles/KeyboardShift.js";
import TouchableScale from "react-native-touchable-scale";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";

import { Styles } from "../styles/GlobalStyles";
import {
  modifyFoodStock,
  logPurchaseDate,
  getFoodList,
  removeFromFoodStock
} from "../utils/FoodListUtils";
import FoodItem from "./components/FoodItem";
import Button from "./components/Button";
import FoodItemForm from "./components/FoodItemForm";
import ApiUtils from "./../api/apiUtils";

// import Bar from 'react-native-bar-collapsible';

import * as firebase from "firebase";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../config/icon-font.json";

const inventoryList = [
  // FOR TESTING PURPOSES
  {
    name: "Rice",
    quantity: "5"
  },
  {
    name: "Peas",
    quantity: "1"
  },
  {
    name: "Carrots",
    quantity: "1"
  },
  {
    name: "Corn",
    quantity: "4"
  },
  {
    name: "Garlic",
    quantity: "3"
  },
  {
    name: "Vegetable Oil",
    quantity: "2"
  }
];

export default class FoodstockScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      tableHead: ["Name", "Quantity", ""],
      externalFoodList: [],
      editable: false,
      ingredients: [],
      itemId: null,
      itemUnit: "",
      itemName: "",
      itemQuantity: null
    };
    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.toggleAddModalVisible = this.toggleAddModalVisible.bind(this);
  }

  //  Toggles whether the information is editable by the user.
  //  User is only able to edit after clicking on the edit button
  toggleEditable() {
    this.setState({
      editable: !this.state.editable
    });

    this.state.editable
      ? Alert.alert("Not editable now")
      : Alert.alert("Values should be editable now.");
  }

  componentDidMount() {
    this._ismounted = true;
    foodList = [];

    // Returns a promise of the user's value
    retrieveData = () => {
      ref = getFoodList(firebase.auth().currentUser.uid);
      return ref.once("value");
    };

    // Snapshot is the depiction of the user's current data
    retrieveData().then(snapshot => {
      if (this._ismounted) {
        foodListSnapshot = snapshot.val();

        for (var key in foodListSnapshot) {
          if (foodListSnapshot.hasOwnProperty(key)) {
            foodList.push({ name: key, quantity: foodListSnapshot[key] });
          }
        }
        this.setState({
          externalFoodList: foodList
        });
      }
    });
  }

  componentWillUnmount() {
    this._ismounted = false; // After components is unmounted reset boolean
  }

  onSaveChangesPress = () => {
    //var user = firebase.auth().currentUser;
    //this.writeUserData(user.uid);
    modifyFoodStock(
      firebase.auth().currentUser.uid,
      this.state.itemId,
      this.state.itemName,
      this.state.itemQuantity,
      this.state.itemUnit
    );

    // create a newFoodList with the new item to replace the externalFoodList
    newFoodList = []
    newFoodList = this.state.externalFoodList;
    newFoodList.push({ name: this.state.itemName, quantity: this.state.itemQuantity });
    console.log(newFoodList);
    this.setState({ 
      addModalVisible: !this.state.addModalVisible,
      externalFoodList: newFoodList
    });

  };

  onDeletePress = () => {
    removeFromFoodStock(firebase.auth().currentUser.uid, "Carrots");
  };

  /**
   * Handler method for adding a new food item
   */
  onAddItemPress() {
    //prompt user for a food item and quantity
    console.log("Add item button was pressed.");
    //push user entered data to firebase
    //addToFoodStock(firebase.auth().currentUser.uid, newItemName, newItemQuantity);
  }

  /**
   * Function to set whether the add item modal is visible or not
   * @param {*} visible - boolean value to set
   */
  toggleAddModalVisible() {
    this.setState({ addModalVisible: !this.state.addModalVisible });
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={Styles.btn}>
          <Text style={Styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <KeyboardShift>
        {() => (
          <ScrollView>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.addModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <FoodItemForm
                datePurchased={new Date()}
                id={null}
                metric=""
                name=""
                parent={this}
                price={null}
                quantity={null}
              />
              <TouchableHighlight onPress={this.onSaveChangesPress}>
                <Text>Save new food item</Text>
              </TouchableHighlight>
            </Modal>

            <View style={Styles.sectionContainer}>
              <Text style={Styles.sectionTitle}> Inventory </Text>

              {/* {//Fetch and display data from firebase
                  this.state.externalFoodList &&
                    this.state.externalFoodList.map((item, i) => (
                      <ListItem
                        key={i}
                        title={item.name}
                        rightTitle={item.quantity}
                        titleStyle={Styles.inventoryText}
                        rightTitleStyle={Styles.quantityText}
                      />
                    ))} */}

              {
                // <View style={Styles.container}>
                //   <Table borderStyle={{ borderColor: "transparent" }}>
                //     <Row
                //       data={state.tableHead}
                //       style={Styles.head}
                //       textStyle={Styles.text}
                //     />
                //     { state.externalFoodList &&
                //       state.externalFoodList.map(rowData => {
                //         return (
                //           <FoodItem
                //             key={rowData.name}
                //             name={rowData.name}
                //             parent={this}
                //             quantity={rowData.quantity}
                //           />
                //         )
                //       })
                //     }
                //   </Table>
                // </View>
              }
              
              <ListItem
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                linearGradientProps={{
                  colors: ["#FF9800", "#F44336"],
                  start: [1, 0],
                  end: [0.2, 0]
                }}
                title="+ Add a new food item"
                titleStyle={{ color: "white", fontWeight: "bold" }}
                onPress={this.toggleAddModalVisible}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardShift>
    );
  }
}
