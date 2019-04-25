import React from "react";
import * as firebase from "firebase";
import {
  Alert,
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

class AddInstructionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: this.props.parent,
      isLoading: true,
      inputModal: "",
      opening: true,
      title: this.props.title,

      id: this.props.id,
      instructionData: this.props.instructionData,
      instruction: "",
      insertAtStep: ""
    };

    this.initialState = {
      parent: this.props.parent,
      isLoading: true,
      inputModal: "",
      opening: true,
      title: this.props.title,

      id: this.props.id,
      instructionData: "",
      instruction: "",
      insertAtStep: ""
    };
    this.onTemporaryAddInstruction = this.onTemporaryAddInstruction.bind(this);
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

  onTemporaryAddInstruction = () => {
    var temp = this.state.instructionData;
    var userInstruction = { step: this.state.instruction };
    if (this.props.parent.tempInstructions) {
      if (
        this.props.parent.tempInstructions.length - 1 <=
        this.state.insertAtStep
      ) {
        temp.splice(parseInt(this.state.insertAtStep) - 1, 0, userInstruction);
      } else {
        temp.push(userInstruction);
      }
      this.props.parent.setState({ tempInstructions: temp });
    } else {
      this.props.parent.setState({ tempInstructions: [userInstruction] });
    }

    this.setState(this.initialState);
  };

  onSaveChangesPress = () => {
    this.onTemporaryAddInstruction();
  };

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
        onRequestClose={() => this.state.parent.toggleInstrModalVisibility()}
      >
        <View style={[styles.container, { ...modalStyleProps }]}>
          <TouchableOpacity
            onPress={() => this.state.parent.toggleInstrModalVisibility()}
          >
            <ScrollView
              contentContainerStyle={[
                styles.modal_container,
                { ...modalStyleProps }
              ]}
            >
              <View style={styles.modal_body}>
                <Text style={styles.title_modal}>{this.state.title}</Text>

                {/* Beginning of content section 
				--------------------------------------------------------------------------------------------------------- */}
                <View style={Styles.screenContainer}>
                  {/* Instruction input section 
				--------------------------------------------------------------------------------------------------------- */}
                  <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}> Instruction </Text>
                    <TextInput
                      style={styles.inputBox_container}
                      multiline={true}
                      numberOfLines={5}
                      value={this.state.instruction}
                      onChangeText={input => {
                        input.length > 120
                          ? this.overCharLimit(input, 120)
                          : this.setState({ instruction: input });
                      }}
                    />
                  </View>

                  {/* Step number Section 
				--------------------------------------------------------------------------------------------------------- */}
                  <View style={styles.dataRow}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.inputLabel}>Step #:</Text>
                      <TextInput
                        style={styles.numberInput_container}
                        value={this.state.insertAtStep}
                        onChangeText={input => {
                          isNaN(input)
                            ? this.handleNaN(input)
                            : this.setState({ insertAtStep: input });
                        }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.onSaveChangesPress}
                  >
                    <Text style={styles.saveText}>Add Instruction Step</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.state.parent.toggleInstrModalVisibility()
                    }
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableOpacity>
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
    marginTop: hPercentage("20%"),
    ...Platform.select({
      ios: {
        backgroundColor: "#E3E6E7",
        borderRadius: 10,
        minWidth: 300
      },
      android: {
        backgroundColor: "#fff",
        // elevation: 24,
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

  inputBox_container: {
    textAlignVertical: "top", // need to set this for android devices if multiline for text input is true
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    borderWidth: 2,
    borderColor: "#009688",
    padding: 2,
    marginTop: 2,
    marginLeft: 2
  },

  numberInput_container: {
    textAlign: "center",
    marginLeft: wPercentage("2.5%"),
    fontSize: 18,
    color: "rgba(0,0,0,0.54)",
    ...Platform.select({
      ios: {
        width: wPercentage("12%"),
        backgroundColor: "white",
        borderRadius: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderColor: "#B0B0B0",
        paddingBottom: 5,
        marginBottom: 15,
        marginTop: 10
      },
      android: {
        width: wPercentage("20"),
        marginTop: 0,
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
			Quantity/Metric picker Styles
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

  quantityInput: {
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
export default AddInstructionModal;
