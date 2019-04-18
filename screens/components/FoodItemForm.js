import React from "react";
import * as firebase from "firebase";
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

import { Divider } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import Autocomplete from "react-native-autocomplete-input";
import AutocompleteData from "./../../data/AutocompleteData";
import { Table, Row, Rows } from "react-native-table-component";
import { Styles } from "./../../styles/GlobalStyles";
import { modifyFoodStock, logPurchaseDate } from "../../utils/FoodListUtils";
import ApiUtils from "../../api/apiUtils";
import LoadingScreen from "./../LoadingScreen";

import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../../config/icon-font.json";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");
/**
 * Form containing all of a food item's information
 */
export default class FoodItemForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datePurchased: this.props.datePurchased,
      id: this.props.id,
      ingredients: AutocompleteData.ingredientSuggestions,
      metric: this.props.metric,
      name: this.props.name,
      nutritionalTags: {},
      parent: this.props.parent,
      price: this.props.price,
      quantity: this.props.quantity,
      query: "",
      unit: this.props.unit,
      isLoading: true,
      tableHead: ["Head", "Head2", "Head3", "Head4"],
      tableData: []
    };

    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
    this.getIngredientInfo = this.getIngredientInfo.bind(this);
  }

  async componentDidMount() {
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
    // console.log("INgredients");
    // console.log(this.state.ingredients);
    // Returns a promise of the user's value
    // await function retrieveData(){
    //   var ref = firebase.database().ref('ingredients/ingredients');
    //   return ref.once('value');
    // }

    // // // Snapshot is the depiction of the user's current data
    // var ingredientSuggestions = await retrieveData().then( (snapshot) => {
    //   if(this._ismounted)
    //   {
    //       this.setState( {
    //         ingredients: snapshot.val()
    //       })

    //     return new Promise((resolve) =>
    //       setTimeout(
    //           () => { resolve('result') },
    //           5000
    //       )
    //     );
    //   }
    // })

    // if(ingredientSuggestions != null){
    //   this.setState({isLoading: false});
    // }
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  onSaveChangesPress = () => {
    const parent = this.state.parent;
    modifyFoodStock(
      firebase.auth().currentUser.uid,
      this.state.id,
      this.state.name,
      this.state.quantity,
      this.state.unit
    );

    // create a newFoodList with the new item to replace the externalFoodList
    newFoodList = [];
    newFoodList = parent.state.externalFoodList;
    newFoodList.push({
      id: this.state.id,
      name: this.state.name,
      quantity: this.state.quantity
    });
    newFoodList.sort((a, b) =>
      a.itemName > b.itemName ? 1 : b.itemName > a.itemName ? -1 : 0
    );

    parent.setState({
      addModalVisible: !parent.state.addModalVisible,
      externalFoodList: newFoodList
    });
  };

  /**
   * Calls the Spoonacular API to autocomplete search for an ingredient
   * @param {string} text
   */
  // async getAutoCompleteIngredientsByName(text) {
  //   this.setState({ query: text });
  //   await ApiUtils.getAutoCompleteIngredientsByName(text, this);
  // }

  async getIngredientInfo(ingrName, ingrId, quantity) {
    console.log(ingrName);
    console.log(ingrId);
    var data = await ApiUtils.getIngredientInfoFromId(ingrId, quantity, this);
    if (data != null && this.state.nutritionalTags != null) {
      console.log(this.state.nutritionalTags);
    }
  }

  /**
   * Filters out ingredient suggestions to the top 5 suggested results
   * @param {string} query
   */
  findIngredient = query => {
    if (query === "") {
      return [];
    }
    const { ingredients } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return ingredients
      .filter(ingredient => ingredient.ingredientName.search(regex) >= 0)
      .slice(0, 5);
  };

  render() {
    const { query } = this.state;
    const ingredients = this.findIngredient(query);
    const comp = (a, b) => a.toLowerCase().trim() == b.toLowerCase().trim();

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
                  addModalVisible: !this.state.parent.state.addModalVisible
                });
              }}
              style={{ marginLeft: wPercentage("5%") }}
            />
          </TouchableOpacity>
          <Text style={styles.addFoodItemTitle}>Add Food Item</Text>
        </View>

        {/* Beginning of content section */}
        <View style={Styles.screenContainer}>
          <View style={styles.dataRow}>
            <Text style={styles.inputLabel}>Search Ingredient by Name</Text>

            <Autocomplete
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
              data={
                ingredients.length === 1 &&
                comp(query, ingredients[0].ingredientName)
                  ? []
                  : ingredients
              }
              defaultValue={query}
              autoCorrect={false}
              placeholder="    Search ingredients..."
              onChangeText={text => this.setState({ query: text })}
              renderItem={({ ingredientName, ingredientId }) => (
                <TouchableOpacity
                  style={styles.itemTextContainer}
                  onPress={() =>
                    this.getIngredientInfo(ingredientName, ingredientId, 1)
                  }
                >
                  <Text style={styles.itemText}>{ingredientName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <Divider />
          <View style={styles.dataRow}>
            <Text style={styles.inputLabel}>Ingredient Name</Text>
            <TextInput
              style={styles.inputData}
              value={this.state.name}
              onChangeText={itemName => this.setState({ name: itemName })}
            />
          </View>

          <Divider />
          <View style={styles.dataRow}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.inputData}
              value={this.state.price}
              onChangeText={itemPrice => this.setState({ price: itemPrice })}
            />
          </View>

          <Divider />
          <View style={styles.dataRow}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.inputData}
              value={this.state.quantity}
              onChangeText={itemQuantity => {
                this.setState({ quantity: itemQuantity });
                this.state.parent.setState({ itemQuantity: itemQuantity });
              }}
            />
          </View>

          <Divider />
          <View style={styles.dataRow}>
            <Text style={styles.inputLabel}>Date Purchased</Text>

            <View style={Styles.selectDate}>
              <DatePicker
                style={{ width: 330 }}
                date={this.state.datePurchased}
                mode="date"
                placeholder="Select date"
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 45,
                    marginRight: 40
                  }
                }}
                onDateChange={date => {
                  this.setState({ datePurchased: date });
                }}
              />
            </View>
          </View>

          <Divider />
          <View styles={styles.dataRow}>
            <Text style={styles.inputLabel}>Ingredient Metric</Text>
            <View style={Styles.choiceContainer}>
              <Picker
                style={Styles.choiceRow}
                selectedValue={this.state.metric}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ metric: itemValue });
                  this.state.parent.setState({ itemUnit: itemValue });
                }}
                mode={"dropdown"}
              >
                <Picker.Item
                  style={styles.picker}
                  label="milliliters"
                  value="milliliter"
                />
                <Picker.Item style={styles.picker} label="grams" value="gram" />
              </Picker>
            </View>
          </View>

          <Divider />
          <View styles={styles.dataRow}>
            <Text style={styles.inputLabel}>Nutritional Information</Text>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
              <Row
                data={this.state.tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              <Rows data={this.state.tableData} textStyle={styles.text} />
            </Table>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={this.onSaveChangesPress}
          >
            <Text style={styles.saveText}>Save new food item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              this.state.parent.setState({
                addModalVisible: !this.state.parent.state.addModalVisible
              });
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
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

  cancelButton: {
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
    marginBottom: hPercentage("5%")
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
