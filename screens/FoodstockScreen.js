import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import KeyboardShift from "../styles/KeyboardShift.js";
import TouchableScale from "react-native-touchable-scale";
import { Styles } from "../styles/GlobalStyles";
import { getFoodList } from "../utils/FoodListUtils";
import FoodItem from "./components/FoodItem";
import AddFoodItemModal from "./components/AddFoodItemModal";
import ApiUtils from "./../api/apiUtils";
import SearchHeaderNav from "./../navigation/SearchHeaderNav";

// import Bar from 'react-native-bar-collapsible';

import * as firebase from "firebase";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../config/icon-font.json";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

export default class FoodstockScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      isFoodInfoModalVisible: false,
      tableHead: ["Name", "Amount", ""],
      externalFoodList: [],
      editable: false,
      ingredients: [],

      // ingredient info
      itemName: "",
      itemId: null,
      Amount: null,
      itemUnit: "",
      itemPrice: null,
      itemDate: "",
      itemNutrientData: null
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

  render() {
    const state = this.state;

    return (
      <View>
        {/* <SearchHeaderNav /> */}
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
            amount={null}
            unit=""
          />

          <View>
            <Text style={Styles.sectionTitle}> Inventory </Text>
            <ListItem
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              containerStyle={{
                backgroundColor: "rgba(50, 181, 175, 1)",
                marginTop: hPercentage("2%"),
                paddingTop: hPercentage("1%"),
                paddingBottom: hPercentage("1%"),
                paddingLeft: wPercentage("8%"),
                paddingRight: wPercentage("8%"),
                borderTopColor: "rgba(0,0,0,0.1)",
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderTopWidth: 1,
                borderBottomWidth: 1
              }}
              title="Add New Food Item"
              rightIcon={
                <Icon name="plus" size={18} color="rgba(255,255,255,1)" />
              }
              titleStyle={{
                color: "rgba(255,255,255,1)",
                fontWeight: "500",
                fontSize: 17,
                paddingRight: wPercentage("2%"),
                textAlign: "center"
              }}
              onPress={this.toggleIngrModalVisibility}
            />
            <View style={Styles.container}>
              <ListItem
                title={state.tableHead[0]}
                rightTitle={state.tableHead[1]}
                titleStyle={{ fontWeight: "500", fontSize: 15 }}
                rightTitleStyle={{ fontWeight: "500", fontSize: 15 }}
              />
              {this.state.externalFoodList.length > 0 ? (
                state.externalFoodList &&
                state.externalFoodList.map(rowData => {
                  return (
                    // Launches food item dialogue that displays the information for each food item, user can also edit values here
                    <FoodItem
                      key={rowData.name}
                      name={rowData.name}
                      id={rowData.id}
                      price={rowData.price}
                      datePurchased={rowData.datePurchased}
                      amount={rowData.amount}
                      unit={rowData.unit}
                      parent={this}
                      tableData={rowData.tableData}
                      foodInfoModalVisible={
                        this.state.isFoodInfoModalVisible
                      }
                    />
                  );
                })
              ) : (
                <Text
                  style={{
                    marginTop: hPercentage("5%"),
                    textAlign: "center"
                  }}
                >
                  Nothing in your inventory. You should probably stock up...
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
