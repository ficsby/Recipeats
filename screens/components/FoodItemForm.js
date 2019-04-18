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
  ScrollView,
  Dimensions,
} from "react-native";
import DatePicker from "react-native-datepicker";
import Autocomplete from "react-native-autocomplete-input";
import AutocompleteData from "./../../data/AutocompleteData";

import { Styles } from "./../../styles/GlobalStyles";
import { modifyFoodStock, logPurchaseDate } from "../../utils/FoodListUtils";
import ApiUtils from "../../api/apiUtils";
import LoadingScreen from './../LoadingScreen';

import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";


const { width: WIDTH } = Dimensions.get("window");


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
      unit: this.props.unit,
      isLoading: true,
    };

    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
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

	// getRecipeInfo() {
	// 	ApiUtils.getIngredientInfoFromId(this.state.id, this);
	// }
	  
	/**
	 * Filters out ingredient suggestions to the top 5 suggested results
	 * @param {string} query
	 */
	findIngredient = (query) => {
		if (query === '') { return []; }
		const { ingredients } = this.state;
		const regex = new RegExp(`${query.trim()}`, 'i');
		return ingredients.filter(ingredient => ingredient.ingredientName.search(regex) >= 0).slice(0, 5);
	}

	render() {
		const { query } = this.state;
		const ingredients = this.findIngredient(query);
		const comp = (a, b) => a.toLowerCase().trim() == b.toLowerCase().trim();

		return (
      <ScrollView>
		{/* <View style={Styles.sectionContainer}> */}
			{/* <View style={styles.searchBar}> */}
				{/* <Text style={Styles.inputLabel}>Ingredient Name</Text> */}

      {/* //</View> */}
      <Text style={styles.pageTitle}>Add Food Item</Text>

			<View style={styles.dataRow}>
      <Text style={styles.inputLabel}></Text>
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
							onPress={() => { this.setState({ query: ingredientName, name: ingredientName, id: ingredientId }); }}
						>
						<Text style={styles.itemText}>{ingredientName}</Text>
						</TouchableOpacity>
					)}
				/>
			</View>

      <Text style={styles.inputLabel}>Price</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={this.state.price}
                onChangeText={itemPrice => {
                  this.setState({ price: itemPrice });
                }}
              />
            </View>

      <Text style={styles.inputLabel}>Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={this.state.quantity}
                onChangeText={itemQuantity => {
                  this.setState({ quantity: itemQuantity });
                  this.state.parent.setState({ itemQuantity: itemQuantity});
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

      <View style={styles.separationLine} />

			<TouchableHighlight style={styles.saveButton} onPress={this.onSaveChangesPress}>
			<Text style={styles.saveChanges}>Save new food item</Text>
			</TouchableHighlight>
		{/* </View> */}
    </ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
//   row: {
//     flex: 1,
//     flexDirection: "row",
//     width: "100%"
//   },

//My changes
pageTitle: {
  height: 50,
  width: '50%',
  fontSize: 22,
  fontWeight: '600',
  color: 'rgba(100, 92, 92, 0.8)', // Dark grey
},

saveButton: {
  marginTop: 50,
  marginBottom: 50,
  marginLeft: 30,
  marginRight: 30,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: 'rgba(204, 102, 102, 0.9)',
  alignItems: 'center',
  justifyContent: 'center',
},

saveChanges: {
  color: 'rgba(255,255,255,1)',
  fontSize: 16,
  fontWeight: '600',
},

dataRow: {
  flex: 1,
  flexDirection: "row",
  marginLeft: 30,
},

inputLabel: {
  width: 160,
  paddingTop: 10,
  fontSize: 15,
  color: 'rgba(100, 92, 92, 1)',
  fontWeight: '500',
  marginLeft: 30,
},

inputContainer: {
  marginTop: hPercentage("2%"),
  marginLeft: 40,
  marginRight: 40,
  height: 40,
  fontSize: 15,
  justifyContent: "center", // Used to set Text Component Vertically Center
  alignItems: "center", // Used to set Text Component Horizontally Center
  backgroundColor: "rgba(244, 238, 238, 0.5)" // Sandy
},

input: {
  width: WIDTH - 130,
  height: 40,
  fontSize: 15,
  marginLeft: -25
  //borderBottomColor: 'rgba(181, 83, 102, 1)', // Medium Pink
  //borderBottomWidth: 2,
},

inputHeading: {
  paddingTop: 30,
  paddingLeft: 30,
  marginBottom: 5,
  fontSize: 18,
  fontWeight: '600',
  color: 'rgba(163, 143, 143, 1)',
},

//

  /*------------------------------------------------------------------------
        Search Bar
    ------------------------------------------------------------------------*/
  searchBar: {
    // flex: 1,
    marginTop: 20
  },

  // dataRow:{
	// marginBottom: 100,
  // },	

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
    // flex: 1,
    // top: 17,
    // zIndex: 1,
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
