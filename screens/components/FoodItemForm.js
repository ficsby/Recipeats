import React from "react";
import * as firebase from "firebase";
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View
} from "react-native";
import DatePicker from "react-native-datepicker";
import Autocomplete from "react-native-autocomplete-input";
import AutocompleteData from "./../../data/AutocompleteData";

import { Styles } from "./../../styles/GlobalStyles";
import { modifyFoodStock, logPurchaseDate } from "../../utils/FoodListUtils";
import ApiUtils from "../../api/apiUtils";

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
      // price: this.props.price,
      quantity: this.props.quantity,
      query: "",
      unit: this.props.unit
    };

    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
  }

  async componentDidMount() {
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
    console.log(this.state.ingredients);
    // Returns a promise of the user's value
    // retrieveData = () => {
    //   var ref = firebase.database().ref('ingredients/ingredients');
    //   return ref.once('value');
    // }

    // // // Snapshot is the depiction of the user's current data
    // retrieveData().then( (snapshot) => {
    //   if(this._ismounted)
    //   {
    //     console.log("Ingredients: \n");
    //     console.log(snapshot.val());
    //       // this.setState( {
    //       //   ingredients: snapshot.val()
    //       // })
    //   }
    // })
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  onSaveChangesPress = () => {
    const parent = this.state.parent;

    console.log(
      this.state.id +
        " " +
        this.state.name +
        " " +
        this.state.quantity +
        " " +
        this.state.unit
    );
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

  getRecipeInfo() {
    ApiUtils.getIngredientInfoFromId(this.state.id, this);
  }

  render() {
    return (
      <View style={Styles.sectionContainer}>
        {/* <View style={styles.searchBar}>
          <Text style={Styles.inputLabel}>Ingredient Name</Text>

          {/* <Autocomplete
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInputContainer}
            data={
              this.state.ingredients.length === 1 &&
              comp(this.state.query, this.state.ingredients[0].name)
                ? []
                : this.state.ingredients
            }

            defaultValue={this.state.query}
            autoCorrect={false}
            placeholder="    Search ingredients..."
            onChangeText={text => this.getAutoCompleteIngredientsByName(text)}
            renderItem={({ id, name }) => (
              <TouchableOpacity
                style={styles.itemTextContainer}
                onPress={() => {
                  this.setState({ query: name, name: name, id: id });
                  this.state.parent.setState({itemName: name, itemId: id});
                }}
              >
                <Text style={styles.itemText}>{name}</Text>
              </TouchableOpacity>
            )}
          /> 
        </View>*/}

        <View style={Styles.dataRow}>
          <Text style={Styles.inputLabel}>Ingredient Name</Text>
          <TextInput
            style={Styles.inputData}
            value={this.state.name}
            onChangeText={itemName => this.setState({ name: itemName })}
          />
        </View>

        {/* <View style={Styles.dataRow}>
          <Text style={Styles.inputLabel}>Price</Text>
          <TextInput
            style={Styles.inputData}
            value={this.state.price}
            onChangeText={itemPrice => this.setState({ price: itemPrice })}
          />
        </View> */}

        <View style={Styles.dataRow}>
          <Text style={Styles.inputLabel}>Quantity</Text>
          <TextInput
            style={Styles.inputData}
            value={this.state.quantity}
            onChangeText={itemQuantity => {
              this.setState({ quantity: itemQuantity });
              this.state.parent.setState({ itemQuantity: itemQuantity });
            }}
          />
        </View>

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

        <Text style={Styles.inputLabel}>Ingredient Metric</Text>
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

        <TouchableHighlight onPress={this.onSaveChangesPress}>
          <Text>Save new food item</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%"
  },

  /*------------------------------------------------------------------------
        Search Bar
    ------------------------------------------------------------------------*/
  searchBar: {
    flex: 1,
    paddingBottom: 20
  },

  /*------------------------------------------------------------------------
       Top Section
    ------------------------------------------------------------------------*/
  topContainer: {
    width: "100%",
    height: 80,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "rgba(244, 238, 238, 0.5)",
    borderBottomColor: "rgba(225, 218, 218, 0.7)",
    borderBottomWidth: 2.1
  },

  /*------------------------------------------------------------------------
        Newsfeed Section
    ------------------------------------------------------------------------*/
  newsfeedContainer: {
    height: "81.2%",
    backgroundColor: "rgba(215, 215, 215, 0.2)"
  },

  /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
  menuBar: {
    width: "20%",
    height: 100,
    backgroundColor: "rgba(225, 218, 218, 0.7)"
  },

  /*------------------------------------------------------------------------
       Autocomplete Section
   ------------------------------------------------------------------------*/

  searchContainer: {
    alignSelf: "center",
    width: "74%",
    marginTop: 10,
    flex: 1,
    top: 17,
    zIndex: 1,
    position: "absolute"
  },

  searchInputContainer: {
    alignSelf: "center",
    width: "94%",
    paddingLeft: 10,
    backgroundColor: "rgba(255,255,255,1)"
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
