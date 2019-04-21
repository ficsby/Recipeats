import React from "react";
import {
  //   Modal,
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
import AddFoodItemModal from "./components/AddFoodItemModal";
import ApiUtils from "./../api/apiUtils";

// import Bar from 'react-native-bar-collapsible';

import * as firebase from "firebase";

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');


import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";



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
      isFoodInfoModalVisible: false,
      tableHead: ["Name", "Quantity", ""],
      externalFoodList: [],
      editable: false,
      ingredients: [],

      // ingredient info
      itemName: "",
      itemId: null,
      itemQuantity: null,
      itemUnit: "",
      itemPrice: null,
      itemDate: "",
      itemNutrientData: null,

    };
    this.toggleIngrModalVisibility = this.toggleIngrModalVisibility.bind(this);
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
            foodList.push(foodListSnapshot[key]);
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

  /**
   * Function to set whether the add item modal is visible or not
   * @param {*} visible - boolean value to set
   */
  toggleIngrModalVisibility() {
    this.setState({ addModalVisible: !this.state.addModalVisible });
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    /**
     * Not sure if this code is ever used or needed for something, will ask later
     */
    // const element = (data, index) => (
    //   <TouchableOpacity onPress={() => this._alertIndex(index)}>
    //     <View style={Styles.btn}>
    //       <Text style={Styles.btnText}>button</Text>
    //     </View>
    //   </TouchableOpacity>
    // );

    return (
      <KeyboardShift>
        {() => (
          <View>
            <ScrollView>
              {/* Launches food item modal to add a food item to user's food stock */}
              <AddFoodItemModal
                isModalVisible={this.state.addModalVisible}
                title={"Add Ingredient to Food Stock"}
                showPriceInput={true}
                showDatePicker={true}
                datePurchased={new Date()}
                id={null}
                name=""
                parent={this}
                price={null}
                quantity={null}
                unit=""
              />

              <View>
                <Text style={Styles.sectionTitle}> Inventory </Text>
                <View style={Styles.container}>
                  <ListItem
                    title={state.tableHead[0]}
                    rightTitle={state.tableHead[1]}
                    titleStyle={{ fontWeight: '500', fontSize: 15 }}
                    rightTitleStyle={{ fontWeight: '500', fontSize: 15 }}
                  />
                  {state.externalFoodList &&
                    state.externalFoodList.map(rowData => {
                      return (

                        // Launches food item dialogue that displays the information for each food item, user can also edit values here
                        <FoodItem
                          key={rowData.name}
                          name={rowData.name}
                          price={rowData.price}
                          datePurchased={rowData.datePurchased}
                          quantity={rowData.quantity}
                          id={rowData.id}
                          parent={this}
                          tableData={rowData.tableData}
                          foodInfoModalVisible={this.state.isFoodInfoModalVisible}
                        />

                      );
                    })}
                </View>
              </View>
            </ScrollView>
            <ListItem
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              containerStyle={{backgroundColor:'rgba(209, 201, 200, 0.2)', 
                               paddingTop: wPercentage('3%'),
                               paddingBottom: wPercentage('3%'), 
                               paddingLeft: wPercentage('5%'), 
                               paddingRight: wPercentage('5%'),
                               borderTopColor: 'rgba(0,0,0,0.1)',
                               borderBottomColor: 'rgba(0,0,0,0.1)',
                               borderTopWidth: 1,
                               borderBottomWidth: 1
                              }}
              title="Add Food Item"
              rightIcon={<Icon name='plus-circled' size={30} color='rgba(63, 61, 58, 1)'/>}
              titleStyle={{ color: 'rgba(63, 61, 58, 1)', fontWeight: '500', fontSize:17, textAlign: 'right' }}
              onPress={this.toggleIngrModalVisibility}
            />
          </View>
        )}
      </KeyboardShift>
    );

  }
}
