import React from "react";
import * as firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Platform,
  Picker,
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

class AddFoodItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      parent: this.props.parent,
      isLoading: true,
      inputModal: "",
      opening: true,
      title: this.props.title,

      id: this.props.id,

      // Autocomplete search bar data
      query: "",
      ingredients: AutocompleteData.ingredientSuggestions,
      name: this.props.name,

      nutritionalTags: {},
      price: this.props.price,
      amount: this.props.amount,
      unit: this.props.unit,
      datePurchased: this.props.datePurchased,

      // data for nutrition info table
      tableHead: ["Title", "Amount", "Unit", "% of Daily Needs"],
      tableData: this.props.tableData,
    };
    
    this.initialState = {

      parent: this.props.parent,
      isLoading: true,
      inputModal: "",
      opening: true,
      title: this.props.title,

      id: '',

      // Autocomplete search bar data
      query: "",
      ingredients: AutocompleteData.ingredientSuggestions,
      name: '',

      nutritionalTags: {},
      price: '',
      amount: '',
      unit: '',
      datePurchased: null,

      // data for nutrition info table
      tableHead: ["Title", "Amount", "Unit", "% of Daily Needs"],
      tableData: [],
    };
    this.onTemporaryAddIngredient = this.onTemporaryAddIngredient.bind(this);
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

  onTemporaryAddIngredient = () => {
    // FRANCIS ASSIGN THE ID SOMEWHERE AROUND HERE PLS & THANK U @@@@@@@@@@@@@~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!***********************%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    var temp = [...this.props.parent.state.tempIngredients];
    temp.push(
      {
        id: this.state.id,      //TEMPORARY FOR NOW
        name: this.state.name,
        amount: this.state.amount,
        unit: this.state.unit
      }
    );
    this.props.parent.setState({ tempIngredients: temp });
  }
  

  onSaveChangesPress = () => {
    const parent = this.state.parent;

    if (this.state.title == 'Add Ingredient to Recipe') {
        this.onTemporaryAddIngredient();
    }
    else if (this.state.title == 'Add Ingredient to Food Stock') {
      modifyFoodStock(
        firebase.auth().currentUser.uid,
        this.state.name,
        this.state.id,
        this.state.price,
        this.state.amount,
        this.state.unit,
        this.state.datePurchased,
        this.state.tableData);
      // create a newFoodList with the new item to replace the externalFoodList
      newFoodList = [];
      newFoodList = parent.state.externalFoodList;
      newFoodList.push({
        name: this.state.name,
        id: this.state.id,
        price: this.state.price,
        amount: this.state.amount,
        unit: this.state.unit,
        datePurchased: this.state.datePurchased,
        nutritionData: this.state.tableData
      });
      newFoodList.sort((a, b) =>
        a.itemName > b.itemName ? 1 : b.itemName > a.itemName ? -1 : 0
      );

      this.setState(this.initialState);
      parent.setState({
        addModalVisible: !parent.state.addModalVisible,
        externalFoodList: newFoodList
      });

      this.setState(this.initialState);
    }
    else {

    }
  };

  /**
   * Calls the Spoonacular API to autocomplete search for an ingredient
   * @param {string} text
   */
  // async getAutoCompleteIngredientsByName(text) {
  //   this.setState({ query: text });
  //   await ApiUtils.getAutoCompleteIngredientsByName(text, this);
  // }

  async getIngredientInfo(ingrName, ingrId, amount) {

    var data = await ApiUtils.getIngredientInfoFromId(ingrId, amount, this);
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

  /**
   * Will show price input if necessary to
   */
  showPriceInput() {
    if (this.props.showPriceInput) {
      return (
        <View style={styles.dataRow}>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            style={styles.input_container}
            value={this.state.price}
            onChangeText={itemPrice => this.setState({ price: itemPrice })}
          />
        </View>
      );
    }
  }

  showDatePicker() {
    if (this.props.showDatePicker) {
      return (
        <View style={styles.dataRow}>
          <Text style={styles.inputLabel}>Date Purchased</Text>

          <View style={styles.selectDate}>
            <DatePicker
              style={{ width: wPercentage("65%") }}
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
      );
    }
  }

  render() {
    const { query } = this.state;
    const ingredients = this.findIngredient(query);
    const comp = (a, b) => a.toLowerCase().trim() == b.toLowerCase().trim();
    let title = this.state.title || "";

    if (!this.state.opening) {
      value = this.state.inputModal;
    } else {
      value = this.props.initValueTextInput
        ? this.props.initValueTextInput
        : "";
    }

    let textProps = this.props.textInputProps || null;
    let modalStyleProps = this.props.modalStyle || {};
    var cancelText = this.props.cancelText || "Cancel";
    var submitText = this.props.submitText || "Submit";
    cancelText = Platform.OS === "ios" ? cancelText : cancelText.toUpperCase();
    submitText = Platform.OS === "ios" ? submitText : submitText.toUpperCase();

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.isModalVisible}
        onRequestClose={() => {
          //   this.props.closeDialog();
          this.parent.setState({ addModalVisible: false });
        }}
      >
	  
        <View style={[styles.container, { ...modalStyleProps }]}>
          <ScrollView
            contentContainerStyle={[
              styles.modal_container,
              { ...modalStyleProps }
            ]}
          >
            <View style={styles.modal_body}>
              <Text style={styles.title_modal}>{title}</Text>

              {/* 
					You can reuse the header to put the title and the close icon on the same row, so leave this commented for now
				*/}
              {/* Title header
				--------------------------------------------------------------------------------------------------------- */}
              {/* <View style={styles.titleRow}>
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
              <Text style={styles.addFoodItemTitle}>
                {this.state.screenTitle}
              </Text>
			</View> */}

              {/* Beginning of content section 
				--------------------------------------------------------------------------------------------------------- */}
              <View style={Styles.screenContainer}>

                {/* Search Ingredient Section 
					User can search for a particular ingredient within the database which would return additional information based on some given info
				--------------------------------------------------------------------------------------------------------- */}
                <View style={styles.dataRow}>
                  <Text style={styles.inputLabel}>
                    Search Ingredient by Name
                  </Text>

                  <Autocomplete
                    // containerStyle={styles.searchContainer}
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
                      // This is the suggestion list the autocomplete compiles while user types in the search bar
                      <TouchableOpacity
                        style={styles.itemTextContainer}
                        onPress={() =>
                          this.getIngredientInfo(
                            ingredientName,
                            ingredientId,
                            1
                          )
                        }
                      >
                        <Text style={styles.itemText}>{ingredientName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                {/* Ingredient Name section 
				--------------------------------------------------------------------------------------------------------- */}
                <View style={styles.dataRow}>
                  <Text style={styles.inputLabel}>Ingredient Name</Text>
                  <TextInput
                    style={styles.input_container}
                    value={this.state.name}
                    onChangeText={itemName => this.setState({ name: itemName })}
                  />
                </View>

                {/* Price Section 
				--------------------------------------------------------------------------------------------------------- */}
                {this.showPriceInput()}

                {/* Amount Section 
				--------------------------------------------------------------------------------------------------------- */}
                <View style={styles.dataRow}>
                  <Text style={styles.inputLabel}>Amount</Text>
                  <View style={styles.metricsRow}>
                    <TextInput
                      style={styles.amountInput}
                      value={this.state.amount}
                      onChangeText={itemAmount => {
                        this.setState({ amount: itemAmount });
                        this.state.parent.setState({
							itemAmount: itemAmount
                        });
                      }}
                    />

                    {/* Food measurements */}
                    <View style={styles.choiceContainer}>
                      <Picker
                        style={styles.metricPicker}
                        selectedValue={this.state.unit}
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({ unit: itemValue });
                          this.state.parent.setState({ itemUnit: itemValue });
                        }}
                      >
                        <Picker.Item
                          style={styles.picker}
                          label="unit"
                          value="units"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="mL (milliliters)"
                          value="milliliters"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="L (liters)"
                          value="liters"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="g (grams)"
                          value="grams"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="mg (milligrams)"
                          value="milligrams"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="kg (kilograms)"
                          value="kilograms"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="tsp (teaspoons)"
                          value="teaspoons"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="tbsp (tablespoons)"
                          value="tablespoons"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="oz (ounces)"
                          value="ounces"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="lb (pounds)"
                          value="pounds"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="pt (pints)"
                          value="pints"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="qt (quarts)"
                          value="quarts"
                        />
                        <Picker.Item
                          style={styles.picker}
                          label="gal (gallons)"
                          value="gallons"
                        />
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* Date purchased Section 
				--------------------------------------------------------------------------------------------------------- */}
                {this.showDatePicker()}

                {/* Nutritional information Section 
				--------------------------------------------------------------------------------------------------------- */}
                <View styles={styles.dataRow}>
                  <Text style={styles.inputLabel}>Nutritional Information</Text>
                  <Table
                    borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
                  >
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
                  <Text style={styles.saveText}>Add Ingredient</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => this.state.parent.toggleIngrModalVisibility()}> 
                        <Text style={styles.cancelChanges}>Cancel</Text>
                    </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      android: {
        backgroundColor: "rgba(0,0,0,0.62)"
      }
    })
  },
  modal_container: {
    marginLeft: 30,
	marginRight: 30,
	marginTop: hPercentage('2%'),
    ...Platform.select({
      ios: {
        backgroundColor: "#E3E6E7",
        borderRadius: 10,
        minWidth: 300
      },
      android: {
        backgroundColor: "#fff",
        elevation: 24,
        maxWidth: wPercentage("85%"),
        borderRadius: 5
      }
    })
  },
  modal_body: {
    ...Platform.select({
      ios: {
        padding: 10
      },
      android: {
        padding: 5
      }
    })
  },
  title_modal: {
    fontWeight: "bold",
    fontSize: 20,
    ...Platform.select({
      ios: {
        marginTop: 10,
        textAlign: "center",
        marginBottom: 5
      },
      android: {
        textAlign: "left"
      }
    })
  },
  message_modal: {
    fontSize: 16,
    ...Platform.select({
      ios: {
        textAlign: "center",
        marginBottom: 10
      },
      android: {
        textAlign: "left",
        marginTop: 20
      }
    })
  },
  input_container: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    ...Platform.select({
      ios: {
        backgroundColor: "white",
        borderRadius: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderColor: "#B0B0B0",
        paddingBottom: 5,
        paddingLeft: 10,
        marginBottom: 15,
        marginTop: 10
      },
      android: {
        marginTop: 8,
        borderBottomWidth: 2,
        borderColor: "#009688"
      }
    })
  },
  btn_container: {
    flex: 1,
    flexDirection: "row",
    ...Platform.select({
      ios: {
        justifyContent: "center",
        borderTopWidth: 1,
        borderColor: "#B0B0B0",
        maxHeight: 48
      },
      android: {
        alignSelf: "flex-end",
        maxHeight: 52,
        paddingTop: 8,
        paddingBottom: 8
      }
    })
  },
  divider_btn: {
    ...Platform.select({
      ios: {
        width: 1,
        backgroundColor: "#B0B0B0"
      },
      android: {
        width: 0
      }
    })
  },
  touch_modal: {
    ...Platform.select({
      ios: {
        flex: 1
      },
      android: {
        paddingRight: 8,
        minWidth: 64,
        height: 36
      }
    })
  },
  btn_modal_left: {
    ...Platform.select({
      fontWeight: "bold",
      ios: {
        fontSize: 18,
        color: "#408AE2",
        textAlign: "center",
        borderRightWidth: 5,
        borderColor: "#B0B0B0",
        padding: 10,
        height: 48,
        maxHeight: 48
      },
      android: {
        textAlign: "right",
        color: "#009688",
        padding: 8
      }
    })
  },
  btn_modal_right: {
    ...Platform.select({
      fontWeight: "bold",
      ios: {
        fontSize: 18,
        color: "#408AE2",
        textAlign: "center",
        padding: 10
      },
      android: {
        textAlign: "right",
        color: "#009688",
        padding: 8
      }
    })
  },

  inputLabel: {
    fontSize: 20,
    color: "rgba(175,76,99,1)"
  },

  inputData: {
    fontSize: 13,
    borderRadius: 4,
    borderWidth: 0.5,
    height: hPercentage("5%")
  },

  dataRow: {
    marginBottom: hPercentage("5%")
  },

  itemText: {
    width: "100%"
  },

  /*------------------------------------------------------------------------
		  Search Bar styles
  ------------------------------------------------------------------------*/

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
    borderWidth: 0,
    borderBottomWidth: 2
    // borderRadius: 4
    // marginTop: -5,
  },

  searchInput: {
    width: wPercentage("100%"),
    fontSize: 15,
    paddingLeft: 10
  },

  itemTextContainer: {
    width: "100%",
    marginLeft: 10
  },

  /*------------------------------------------------------------------------
		  Amount/Metric picker Styles
	------------------------------------------------------------------------*/
  choiceContainer: {
    backgroundColor: "rgba(244, 238, 238, 0.7)",
    marginLeft: wPercentage("4%")
  },
  metricsRow: {
    flex: 1,
    flexDirection: "row",
    width: wPercentage("100%")
  },

  metricPicker: {
    height: hPercentage("5%"),
    width: wPercentage("35%")
  },

  amountInput: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    width: wPercentage("25%"),
    ...Platform.select({
      ios: {
        backgroundColor: "white",
        borderRadius: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderColor: "#B0B0B0",
        paddingBottom: 5,
        paddingLeft: 10,
        marginBottom: 15,
        marginTop: 10
      },
      android: {
        marginTop: 8,
        borderBottomWidth: 2,
        borderColor: "#009688"
      }
    })
  },

  /*------------------------------------------------------------------------
		  Date Styles
	------------------------------------------------------------------------*/
  selectDate: {
    // marginRight: 40,
    // paddingLeft: 40,
    fontSize: 15,
    color: "rgba(91, 88, 88, 0.9)"
  },
  /*------------------------------------------------------------------------
		  Save Button Styles
	------------------------------------------------------------------------*/
  saveButton: {
    marginVertical: hPercentage("3%"),
    height: hPercentage("5%"),
    backgroundColor: "rgba(175,76,99,1)",
    color: "rgba(249, 248, 248, 1)",
    justifyContent: "center",
    alignItems: "center"
  },

  saveText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    width: '100%',
    color: "rgba(249, 248, 248, 1)"
  },

  cancelButton: {
    height: hPercentage("5%"),
    // backgroundColor: "rgba(175,76,99,1)",
    // color: "rgba(249, 248, 248, 1)",
    justifyContent: "center",
    alignItems: "center"
  },

  cancelText: {
    fontSize: 16,
    // color: "rgba(249, 248, 248, 1)",
    textAlign: "center",
    width: wPercentage("100%")
  },

  cancelButton: {
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
},

cancelChanges: {
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,1)',
    fontSize: 16,
    fontWeight: '600',
},
});
export default AddFoodItemModal;
