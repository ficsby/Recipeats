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
  ScrollView,
  CameraRoll
} from "react-native";

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
import NavigationService from "../../navigation/NavigationService";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

class CreateRecipeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      inputModal: "",
      opening: true,

      id: null,
      title: "",
      image: "",
      servings: "",
      readyInMinutes: "",

      calories: "",
      protein: "",
      carbs: "",
      fats: "",

      // amount: '',
      // unit: '',
      dateCreated: ""

      // data for nutrition info table
      //   tableHead: ["Title", "Amount", "Unit", "% of Daily Needs"],
      //   tableData: [],
    };
    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
  }

  async componentDidMount() {
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  handleNaN(text) {
    Alert.alert("This input must be a number.");
    text = text.substring(0, text.length - 1);
  }

  overCharLimit(text, charLimit) {
    Alert.alert("You cannot exceed " + charLimit.toString() + " characters.");
    text = text.substring(0, text.length - 1);
  }

  onSaveChangesPress() {
    var temp = [...this.props.parent.state.customRecipes];

    var newRecipe = {
      id: this.state.id,
      title: this.state.title,
      servings: this.state.servings,
      readyInMinutes: this.state.readyInMinutes,
      calories: this.state.calories,
      protein: this.state.protein,
      carbs: this.state.carbs,
      fats: this.state.fats,
      bookmarked: false,
      liked: false
      // As well as other recipe information
    };
    temp.push(newRecipe);

    this.props.parent.setState({ customRecipes: temp });
    firebase
      .database()
      .ref(
        "customRecipes/" +
          firebase.auth().currentUser.uid +
          "/" +
          this.state.title +
          "_" +
          this.state.id
      )
      .set({
        id: this.state.id,
        title: this.state.title,
        servings: this.state.servings,
        readyInMinutes: this.state.readyInMinutes,
        calories: this.state.calories,
        protein: this.state.protein,
        carbs: this.state.carbs,
        fats: this.state.fats,
        bookmarked: false,
        liked: false,

        nutrients: {},
        sourceUrl: "",
        creditText: "",
        sourceName: "",
        image: ""
      });

    this.props.parent.setState({
      recipeModalVisible: false,
      recipeCreated: true
    });
  }

  changeText(input) {
    var sumOfTitle = 0;
    this.state.title
      .toUpperCase()
      .split("")
      .forEach(function(alphabet) {
        sumOfTitle += alphabet.charCodeAt(0) - 64;
      });

    var newId = -1 * (this.state.title.length * sumOfTitle);
    this.setState({ id: newId, title: input });
  }
  render() {
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
          this.props.parent.setState({ recipeModalVisible: false });
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
              {/* 	You can reuse the header to put the title and the close icon on the same row, so leave this commented for now
               */}
              {/* Title header
				--------------------------------------------------------------------------------------------------------- */}

              <Text style={styles.title_modal}>Create New Recipe</Text>

              {/* Beginning of content section 
			            -------------------------------------------------------------------------------------------------- */}
              <View style={Styles.screenContainer}>
                <Text style={styles.inputHeader}>Basic Information</Text>

                {/* Recipe Basic Information Section 
                    -----------------------------*/}
                <View style={styles.dataRow}>
                  <Text style={styles.inputLabel}>Title: </Text>
                  <TextInput
                    style={styles.long_input_container}
                    value={this.state.title}
                    onChangeText={input =>
                      input.length > 40
                        ? this.overCharLimit(input, 40)
                        : this.changeText(input)
                    }
                  />
                </View>

                <View style={styles.dataRow}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.inputLabel}>Cook Time (mins): </Text>
                    <Text style={styles.inputLabel}>Servings: </Text>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.readyInMinutes}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ readyInMinutes: input })
                      }
                    />
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.servings}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ servings: input })
                      }
                    />
                  </View>
                </View>

                {/* Macronutrient Section 
                 --------------------------------------------------------------------------------------------- */}
                <Text style={styles.inputHeader}>Macronutrients</Text>

                <View style={styles.dataRow}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.inputLabel}>Calories: </Text>
                    <Text style={styles.inputLabel}>Protein: </Text>
                    <Text style={styles.inputLabel}>Carbs: </Text>
                    <Text style={styles.inputLabel}>Fats: </Text>
                  </View>

                  <View style={{ flexDirection: "column" }}>
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.calories}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ calories: input })
                      }
                    />
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.protein}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ protein: input })
                      }
                    />
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.carbs}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ carbs: input })
                      }
                    />
                    <TextInput
                      style={styles.short_input_container}
                      value={this.state.fats}
                      onChangeText={input =>
                        isNaN(input)
                          ? this.handleNaN(input)
                          : this.setState({ fats: input })
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={this.onSaveChangesPress}
                >
                  <Text style={styles.saveText}>Create Recipe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.props.parent.setState({ recipeModalVisible: false });
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
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
    flexDirection: "column",
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
    marginTop: hPercentage("8%"),
    ...Platform.select({
      ios: {
        backgroundColor: "#E3E6E7",
        borderRadius: 10,
        minWidth: 300
      },
      android: {
        backgroundColor: "#fff",
        elevation: 24,
        // maxHeight: wPercentage('100%'),
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
        padding: 15
      }
    })
  },
  title_modal: {
    fontWeight: "bold",
    fontSize: 24,
    ...Platform.select({
      ios: {
        marginTop: 10,
        textAlign: "center",
        marginBottom: 5
      },
      android: {
        textAlign: "left",
        marginLeft: wPercentage("5%")
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
  short_input_container: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    width: wPercentage("15%"),
    marginTop: hPercentage("1.4%"),
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
        borderBottomWidth: 2,
        borderColor: "#009688"
      }
    })
  },
  long_input_container: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    width: wPercentage("45%"),
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

  inputHeader: {
    width: wPercentage("100%"),
    marginBottom: hPercentage("2%"),
    marginTop: hPercentage("3%"),
    fontSize: 24,
    fontWeight: "500",
    color: "rgba(137, 35, 59, 1)"
  },

  inputLabel: {
    marginTop: hPercentage("2%"),
    marginRight: wPercentage("4%"),
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
    flex: 1,
    flexDirection: "row"
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

  input_container: {
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
			Save Button Styles
	  ------------------------------------------------------------------------*/
  saveButton: {
    marginTop: hPercentage("10%"),
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
    width: "100%",
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
  }
});
export default CreateRecipeModal;
