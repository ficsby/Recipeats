import React from "react";
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ScrollView
} from "react-native";
import * as firebase from "firebase";
import { Divider } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import Autocomplete from "react-native-autocomplete-input";
import AutocompleteData from "../../data/AutocompleteData";
import { Table, Row, Rows } from "react-native-table-component";
import { Styles } from "../../styles/GlobalStyles";
import {
  findMissingFoodItems,
  findSimilarFoodItems,
  modifyFoodStock,
  abbreviateUnit,
  getFoodList
} from "../../utils/FoodListUtils";
import ApiUtils from "../../api/apiUtils";
import LoadingScreen from "../LoadingScreen";

import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../../config/icon-font.json";
import apiUtils from "../../api/apiUtils";

const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

/**
 * Form containing all of a food item's information
 */
export default class ComparisonModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      parent: this.props.parent,
      foodstock: this.props.foodstock,
      filteredFoodStock: [],
      convertedAmount: [],
      recipeIngredients: this.props.recipeIngredients,
      isLoading: true,
      tableHead: ["Name", "Required", "Your Stock", "Amount After"],
      tableData: []
    };

    // this.getIngredientInfo = this.getIngredientInfo.bind(this);
  }

  async componentDidMount() {
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
    // console.log(this.state.recipeIngredients);
    // Snapshot is the depiction of the user's current data
    await this.compareRecipes();
    if (this.state.tableData != null) {
      this.setState({ isLoading: false });
    }
    // const similarItems = findSimilarFoodItems(this.state.recipeIngredients, this.state.foodstock);
    // console.log('similar items');
    // console.log(similarItems);
    // apiUtils.convertAmount(reqAmount, userAmountUnit, this);
    // console.log(this.state.foodstock);
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  async compareRecipes() {
    ingrDict = {}
    ingrYouHave = []
    ingrYouDontHave = []

    // console.log('Recipes');
    // console.log(this.state.recipeIngredients);
    for (idx in this.state.recipeIngredients) {
      ingr = this.state.recipeIngredients[idx];
      ingrDict[ingr.id] = ingr;
    }
    // console.log('foodstock');
    // console.log(this.state.foodstock);
    convertedData = [];
    for (idx in this.state.foodstock) {
      userStockIngrInfo = this.state.foodstock[idx];
      ingrId = userStockIngrInfo.id;
      if (ingrId in ingrDict) {
        // Recipe Ingredient Data
        recipeIngrInfo = ingrDict[ingrId];
        ingrName = recipeIngrInfo.name;
        reqAmountPhrase = recipeIngrInfo.original;
        reqAmount = recipeIngrInfo.amount;
        recipeUnit = recipeIngrInfo.unit;

        userAmountUnit = userStockIngrInfo.unit;
        userAmount = userStockIngrInfo.amount;
        convertedAmount = await apiUtils.convertAmount(reqAmount, userAmountUnit, this);
        amountDifference = userAmount - this.state.convertedAmount.targetAmount;
        convertedData.push([
          ingrName, reqAmount + ' ' + abbreviateUnit(recipeUnit), userAmount + ' ' + abbreviateUnit(userAmountUnit),
          amountDifference + ' ' + abbreviateUnit(userAmountUnit)
        ]);
      }
    }
    this.setState({ tableData: convertedData });
  }

  /**
   * Calls the Spoonacular API to autocomplete search for an ingredient
   * @param {string} text
   */
  // async getAutoCompleteIngredientsByName(text) {
  //   this.setState({ query: text });
  //   await ApiUtils.getAutoCompleteIngredientsByName(text, this);
  // }

  //   async getIngredientInfo(ingrName, ingrId, quantity) {
  //     console.log(ingrName);
  //     console.log(ingrId);
  //     var data = await ApiUtils.getIngredientInfoFromId(ingrId, quantity, this);
  //     if (data != null && this.state.nutritionalTags != null) {
  //       console.log(this.state.nutritionalTags);
  //     }
  //   }

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title bar */}
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={this.onGoBack}>
            <Icon
              name="left"
              size={30}
              color="rgba(100, 92, 92, 0.8)"
              onPress={() => {
                this.state.parent.setState({
                  comparisonModalVisible: !this.state.parent.state.comparisonModalVisible
                });
              }}
              style={{ marginLeft: wPercentage("5%") }}
            />
          </TouchableOpacity>
          <Text style={styles.addFoodItemTitle}>Food Stock Comparison</Text>
        </View>

        {/* Beginning of content section */}
        <View style={Styles.screenContainer}>

          <View styles={styles.dataRow}>
            <Text style={styles.inputLabel}>Results</Text>
            <Table style={{marginBottom: hPercentage('5%'), marginTop:hPercentage('1%')}} borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
              <Row
                data={this.state.tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              <Rows data={this.state.tableData} textStyle={styles.text} />
            </Table>
          </View>

          <View styles={styles.dataRow}>
            <Text style={styles.inputLabel}>Missing Ingredients</Text>
            <Text style={{marginTop:hPercentage('1%')}}>
              {findMissingFoodItems(
                this.state.recipeIngredients,
                this.state.foodstock
              ).reduce((missingStr, food) => {
                missingStr = missingStr + food.name + ", ";
                return missingStr;
              }, "")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              this.state.parent.setState({
                comparisonModalVisible: !this.state.parent.state.comparisonModalVisible
              });
            }}
          >
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  /*------------------------------------------------------------------------
		  General Styles
	  ------------------------------------------------------------------------*/
  sectionContainer: {
    marginHorizontal: wPercentage("3%"),
    marginVertical: hPercentage("3%")
  },

  titleRow: {
    flex: 1,
    flexDirection: "row",
    width: wPercentage("100%"),
    height: hPercentage("9%"),
    backgroundColor: "rgba(249, 248, 248, 1)",
    borderBottomColor: "rgba(141, 130, 130, 1)",
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },

  addFoodItemTitle: {
    flex: 3,
    fontSize: 22,
    fontWeight: "600",
    color: "rgba(100, 92, 92, 0.8)", // Dark grey
    width: wPercentage("100%"),
    marginRight: wPercentage("10%"),
    textAlign: "center"
  },

  saveButton: {
    marginVertical: hPercentage("3%")
  },

  saveText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600"
  },

  closeButton: {
    marginTop: hPercentage('5%'),
    height: hPercentage("5%"),
    backgroundColor: "rgba(175,76,99,1)",
    color: "rgba(249, 248, 248, 1)",
    justifyContent: "center",
    alignItems: "center"
  },

  cancelText: {
    fontSize: 30,
    color: "rgba(249, 248, 248, 1)",
    textAlign: "center",
    width: wPercentage("100%")
  },

  inputLabel: {
    fontSize: 25,
    color: "rgba(175,76,99,1)"
  },

  inputData: {
    fontSize: 13,
    borderRadius: 4,
    borderWidth: 0.5,
    height: hPercentage("5%")
  },

  /*------------------------------------------------------------------------
		  Search Bar
	  ------------------------------------------------------------------------*/
  searchBar: {
    flex: 1,
    paddingBottom: 20
  },

  dataRow: {
    // marginBottom: hPercentage("5%")
  },

  searchContainer: {
    alignSelf: "center",
    width: wPercentage("95%"),
    marginTop: 3
  },

  searchInputContainer: {
    alignSelf: "center",
    width: "94%",
    paddingLeft: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 4
    // marginTop: -5,
  },

  searchInput: {
    width: "100%",
    fontSize: 15,
    paddingLeft: 10
  },

  itemTextContainer: {
    width: "100%",
    marginLeft: 10
  },

  itemText: {
    width: "100%"
  }
});
