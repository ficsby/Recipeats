import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Picker,
  Alert,
  Dimensions
} from "react-native";
import * as firebase from "firebase";
import DatePicker from "react-native-datepicker";
import KeyboardShift from "./../../styles/KeyboardShift.js";
import AutocompleteData from './../../data/AutocompleteData';
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

const { width: WIDTH } = Dimensions.get("window");

export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
      weight: "",
      height: "",
      activityLevel: "Sedentary",
      birthDate: "",
      selectedHeightMetric: "in",
      selectedGender: "Male",
      ingredientSuggestions: []
    };
  }

  writeUserData = userId => {
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
        weight: this.state.weight,
        activityLevel: this.state.activityLevel,
        birthDate: this.state.birthDate,
        height: this.state.height,
        selectedHeightMetric: this.state.selectedHeightMetric,
        selectedGender: this.state.selectedGender
      });
  };

  // handles not a number exception
  handleNaN = text => {
    Alert.alert("Please enter a number");
    text = text.substring(0, text.length - 1);
  };

  onSignUpPress = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          var user = firebase.auth().currentUser;
          this.writeUserData(user.uid);
          user.sendEmailVerification();
          retrieveData = () => {
            var ref = firebase.database().ref('ingredients/ingredients');
            return ref.once('value');
          }
      
          // // Snapshot is the depiction of the user's current data
          retrieveData().then( (snapshot) => {
            this.setState( {
                ingredientSuggestions: snapshot.val()
            })
          })
          AutocompleteData.ingredientSuggestions = ingredientSuggestions;
          this.props.navigation.navigate("Home");
          // do nothing, success of creating will move onto the main page
        },
        error => {
          Alert.alert(error.message);
        }
      );
  };

  onBackToLogin = () => {
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <KeyboardShift>
        {() => (
          <ScrollView>
            <Text style={styles.pageTitle}>Sign Up</Text>

            {/* BASIC USER INFORMATION  */}

            <Text style={styles.inputHeading}>Your basic information</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={this.state.name}
                onChangeText={text => {
                  this.setState({ name: text });
                }}
              />
            </View>

            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={this.state.username}
                onChangeText={text => {
                  this.setState({ username: text });
                }}
              />
            </View>

            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={this.state.email}
                onChangeText={text => {
                  this.setState({ email: text });
                }}
              />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={text => {
                  this.setState({ password: text });
                }}
              />
            </View>

            <Text style={styles.inputLabel}>Password Confirmation</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={this.state.passwordConfirm}
                onChangeText={text => {
                  this.setState({ passwordConfirm: text });
                }}
              />
            </View>

            {/* PHYSICAL INFORMATION  */}

            <Text style={styles.inputHeading}>Your physical information</Text>

            <Text style={styles.inputLabel}>Birthday</Text>

            <View style={styles.selectDate}>
              <DatePicker
                style={{ width: 330 }}
                date={this.state.birthDate}
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
                  this.setState({ birthDate: date });
                }}
              />
            </View>

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.choiceContainer}>
              <Picker
                style={styles.choiceRow}
                selectedValue={this.state.selectedGender}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedGender: itemValue })
                }
                mode={"dropdown"}
              >
                <Picker.Item style={styles.picker} label="Male" value="Male" />
                <Picker.Item
                  style={styles.picker}
                  label="Female"
                  value="Female"
                />
                <Picker.Item
                  style={styles.picker}
                  label="Other"
                  value="Other"
                />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Height</Text>

            <View style={styles.row}>
              <View style={styles.heightContainer}>
                <TextInput
                  style={styles.input}
                  value={this.state.height}
                  onChangeText={text => {
                    this.setState({ height: text });
                  }}
                />
              </View>
              <View
                style={
                  (style = {
                    backgroundColor: "rgba(215, 203, 203, 0.35)",
                    height: 40,
                    width: 90
                  })
                }
              >
                <Picker
                  style={styles.pickerContainer}
                  itemStyle={{ backgroundColor: "rgba(215, 203, 203, 0.35)" }}
                  selectedValue={this.state.selectedHeightMetric}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ selectedHeightMetric: itemValue })
                  }
                  mode={"dropdown"}
                >
                  <Picker.Item label="in" value="in" />
                  <Picker.Item label="cm" value="cm" />
                </Picker>
              </View>
            </View>

            <Text style={styles.inputLabel}>Weight</Text>
            <View style={styles.row}>
              <View style={styles.heightContainer}>
                <TextInput
                  style={styles.input}
                  value={this.state.weight}
                  onChangeText={text => {
                    isNaN(text)
                      ? (text = this.handleNaN(text))
                      : this.setState({ weight: text });
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: "rgba(215, 203, 203, 0.35)",
                  height: 40,
                  width: 90
                }}
              >
                <Picker
                  style={styles.pickerContainer}
                  selectedValue={this.state.selectedHeightMetric}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ selectedHeightMetric: itemValue })
                  }
                  mode={"dropdown"}
                >
                  <Picker.Item style={styles.picker} label="lbs" value="lbs" />
                  <Picker.Item style={styles.picker} label="kg" value="kg" />
                </Picker>
              </View>
            </View>

            <Text style={styles.inputLabel}>Activity Level</Text>
            <View style={styles.choiceContainer}>
              <Picker
                style={styles.choiceRow}
                selectedValue={this.state.activityLevel}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ activityLevel: itemValue })
                }
                mode={"dropdown"}
              >
                <Picker.Item
                  style={styles.picker}
                  label="Sedentary"
                  value="Sedentary"
                />
                <Picker.Item
                  style={styles.picker}
                  label="Lightly Active"
                  value="Lightly Active"
                />
                <Picker.Item
                  style={styles.picker}
                  label="Active"
                  value="Active"
                />
                <Picker.Item
                  style={styles.picker}
                  label="Very Active"
                  value="Very Active"
                />
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={this.onSignUpPress}
            >
              <Text style={styles.signupText}>SIGN UP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={this.onBackToLogin}
            >
              <Text style={{ color: "rgba(0,0,0,0.55)" }}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  /*------------------------------------------------------------------------
    General
------------------------------------------------------------------------*/
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("5%"),
    marginLeft: 40,
    marginRight: 40,
    height: 40,
    backgroundColor: "rgba(244, 238, 238, 0.7)"
  },

  /*------------------------------------------------------------------------
    Top Section
------------------------------------------------------------------------*/
  pageTitle: {
    paddingTop: 30,
    fontSize: 35,
    textAlign: "center",
    color: "rgba(181, 83, 102, 1)" // Medium Pink
  },

  /*------------------------------------------------------------------------
    User Information Section
------------------------------------------------------------------------*/

  inputHeading: {
    paddingTop: 30,
    paddingLeft: 40,
    marginBottom: hPercentage("2%"),
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(91, 88, 88, 0.9)"
  },

  inputLabel: {
    marginTop: hPercentage("1%"),
    paddingLeft: 40,
    paddingTop: 10,
    fontSize: 15,
    color: "rgba(91, 88, 88, 0.9)"
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
    marginLeft: wPercentage('-7%')
  },

  pickerContainer: {
    flex: 1
  },

  heightContainer: {
    flex: 2,
    flexWrap: "wrap",
    height: 40,
    marginLeft: wPercentage('10%')
  },

  choiceContainer: {
    backgroundColor: "rgba(244, 238, 238, 0.7)",
    height: 40,
    marginTop: hPercentage('2%'),
    marginLeft: wPercentage('10%'),
    marginRight: wPercentage('10%')
  },

  choiceRow: {
    flex: 1,
    flexDirection: "row",
    marginTop: 7,
    marginBottom: 10,
    marginLeft: 5,
    height: 40
  },

  /*------------------------------------------------------------------------
    Buttons
------------------------------------------------------------------------*/

  signupButton: {
    marginTop: hPercentage('5%'),
    marginBottom: hPercentage('5%'),
    marginRight: wPercentage('5%'),
    marginLeft: wPercentage('5%'),
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "rgba(204, 102, 102, 0.9)",
    alignItems: "center",
    justifyContent: "center"
  },

  signupText: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "500",
    fontSize: 17,
    width: 100,
    textAlign: "center"
  },

  loginButton: {
    marginBottom: hPercentage('3%'),
    marginRight: wPercentage('5%'),
    marginLeft: wPercentage('5%'),
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  selectDate: {
    marginBottom: hPercentage("7%"),
    marginRight: 40,
    paddingLeft: 40,
    paddingTop: 10,
    fontSize: 15,
    color: "rgba(91, 88, 88, 0.9)"
  }
});
