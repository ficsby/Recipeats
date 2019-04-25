import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image
} from "react-native";
import { StackActions } from "react-navigation";
import { ListItem } from "react-native-elements";
import * as firebase from "firebase";

import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

import KeyboardShift from "./../../styles/KeyboardShift.js";
import defAccIcon from "./../../assets/images/default_acc_icon.png";
/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../../config/icon-font.json";
import { ImagePicker } from "expo";

const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

export default class EditAccountScreen extends React.Component {
  user = firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      return user;
      // User is signed in.
    } else {
      // No user is signed in.
      return null;
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      editable: false,
      name: "",
      email: "",
      password: "",
      username: "",
      weight: "",
      height: "",
      activityLevel: "",
      birthDate: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      budget: "",
      userAccPicture: "",
      selectedHeightMetric: "",
      selectedGender: ""
    };
    this.toggleEditable = this.toggleEditable.bind(this);
    this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
  }

  //  Toggles whether the information is editable by the user.
  //  User is only able to edit after clicking on the edit button
  toggleEditable() {
    this.setState({
      editable: !this.state.editable
    });

    this.state.editable
      ? Alert.alert("Your changes has been updated.")
      : Alert.alert("You may edit your information.");
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3]
    });

    if (!result.cancelled) {
      this.setState({ userAccPicture: result.uri });
    }
  };

  componentDidMount() {
    this._ismounted = true; // Set boolean to true, then for each setState call have a condition that checks if _ismounted is true

    // Returns a promise of the user's value
    retrieveData = () => {
      ref = firebase.database().ref("users/" + firebase.auth().currentUser.uid);
      return ref.once("value");
    };

    // Snapshot is the depiction of the user's current data
    retrieveData().then(snapshot => {
      if (this._ismounted) {
        this.setState({
          user: snapshot.val(),
          name: snapshot.val().name,
          email: snapshot.val().email,
          username: snapshot.val().username,
          weight: snapshot.val().weight,
          height: snapshot.val().height,
          activityLevel: snapshot.val().activityLevel,
          birthDate: snapshot.val().birthDate,
          calories: (snapshot.val().calories)? snapshot.val().calories: "---" ,
          protein:  (snapshot.val().protein)? snapshot.val().protein: "---" ,
          carbs:  (snapshot.val().carbs)? snapshot.val().carbs: "---" ,
          fats:  (snapshot.val().fats)? snapshot.val().fats: "---" ,
          budget: snapshot.val().budget,
          selectedHeightMetric: snapshot.val().selectedHeightMetric,
          selectedGender: snapshot.val().selectedGender
        });
      }
    });
  }

  componentWillUnmount() {
    this._ismounted = false; // After components is unmounted reset boolean
  }

  // Writes user data to the database
  writeUserData = () => {
    var user = this.state.user;
    var userAccPicture = this.imageSource();
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .update({
        name: this.state.name ? this.state.name : "",
        email: this.state.email ? this.state.email : "",
        username: this.state.username ? this.state.username : "",
        weight: this.state.weight ? this.state.weight : "",
        height: this.state.height ? this.state.height : "",
        activityLevel: this.state.activityLevel ? this.state.activityLevel : "",
        birthDate: this.state.birthDate ? this.state.birthDate : "",
        calories: this.state.calories ? this.state.calories : "",
        protein: this.state.protein ? this.state.protein : "",
        carbs: this.state.carbs ? this.state.carbs : "",
        fats: this.state.fats ? this.state.fats : "",
        budget: this.state.budget ? this.state.budget : "",
        selectedHeightMetric: this.state.selectedHeightMetric
          ? this.state.selectedHeightMetric
          : "",
        selectedGender: this.state.selectedGender
          ? this.state.selectedGender
          : "",
        userAccPicture: userAccPicture ? userAccPicture : ""
      });
  };

  imageSource() {
    if (this.state.user.userAccPicture != this.state.userAccPicture) {
      return this.state.userAccPicture;
    } else if (this.state.user.userAccPicture) {
      return this.state.user.userAccPicture;
    } else {
      return "";
    }
  }

  // Handles not a number exception
  handleNaN = text => {
    Alert.alert("Please enter a number");
    text = text.substring(0, text.length - 1);
  };

  // Function for when user clicks the 'Save Button'
  onSaveChangesPress = () => {
    this.writeUserData();
    this.toggleEditable();
  };

  // Function for when user clicks the 'Arrow back Button'
  onGoBack = () => {
    // To go back to previous screen pop the current screen
    var navActions = StackActions.pop({
      n: 1 // n is number of screens to pop
    });

    this.props.navigation.dispatch(navActions);
  };

  render() {
    const { user } = this.state;

    const inputDataStyle = (this.state.editable)? styles.inputDataBoxed : styles.inputData;
    const inputMacrosStyle = (this.state.editable)? styles.macrosInputDataBoxed : styles.macrosInputData;

    // if (this.state.ed)
    if (this._ismounted) {
      return (
        <KeyboardShift>
          {() => (
            <ScrollView>
              <View style={styles.titleRow}>
                {/* Side bar navigation icon */}
                <TouchableOpacity
                  style={{ height: 80 }}
                  onPress={this.onGoBack}
                >
                  <Icon
                    name="left"
                    size={30}
                    color="rgba(100, 92, 92, 0.8)"
                    style={{ marginLeft: "20%" }}
                  />
                </TouchableOpacity>

                <Text style={styles.pageTitle}>Account Settings</Text>
                {!this.state.editable ? (
                  <TouchableOpacity style={styles.editButton} onPress={this.toggleEditable}>
                    <Text style={{textDecorationLine: 'underline'}}> Edit </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.imageContainer}
                onPress={this._pickImage}
              >
                <Image
                  source={
                    this.state.userAccPicture == ""
                      ? (this.state.editable)? require('./../../assets/images/default_acc_icon_edit.png') : require('./../../assets/images/default_acc_icon.png')
                      : { uri: this.state.userAccPicture }
                  }
                  style={styles.userAvatar}
                />
              </TouchableOpacity>

              <Text style={styles.inputHeading}>Your basic information</Text>

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.name}
                  onChangeText={name => this.setState({ name })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.username}
                  onChangeText={username => this.setState({ username })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={inputDataStyle}
                  value="ENCRYPTED"
                  onChangeText={password =>
                    firebase
                      .auth()
                      .currentUser.updatePassword(password)
                      .then(function() {
                        // no error
                      })
                      .catch(function(err) {
                        Alert.alert(err);
                      })
                  }
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <Text style={styles.inputHeading}>Your physical information</Text>

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Birthday</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.birthDate}
                  onChangeText={birthDate => this.setState({ birthDate })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.selectedGender}
                  onChangeText={selectedGender =>
                    this.setState({ selectedGender })
                  }
                  editable={this.state.editable}
                />
              </View>

              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Height</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.height}
                  onChangeText={height => this.setState({ height })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Weight</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.weight}
                  onChangeText={weight => this.setState({ weight })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <View style={styles.dataRow}>
                <Text style={styles.inputLabel}>Level of Activity</Text>
                <TextInput
                  style={inputDataStyle}
                  value={this.state.activityLevel}
                  onChangeText={activityLevel =>
                    this.setState({ activityLevel })
                  }
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.separationLine} />

              <Text style={styles.inputHeading}>Macro Goals</Text>

              <View style={styles.dataRow}>
                <Text style={styles.macroLabel}>Calories</Text>
                <TextInput
                  style={inputMacrosStyle}
                  value={this.state.calories}
                  onChangeText={calories => this.setState({ calories })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.macroLabel}>Protein</Text>
                <TextInput
                  style={inputMacrosStyle}
                  value={this.state.protein}
                  onChangeText={protein => this.setState({ protein })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.macroLabel}>Fats</Text>
                <TextInput
                  style={inputMacrosStyle}
                  value={this.state.fats}
                  onChangeText={fats => this.setState({ fats })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <TextInput
                  style={inputMacrosStyle}
                  value={this.state.carbs}
                  onChangeText={carbs => this.setState({ carbs })}
                  editable={this.state.editable}
                />
              </View>
              <View style={styles.macroSeparationLine} />

              <View style={styles.whitespaceBuffer} />
              {this.state.editable ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={this.onSaveChangesPress}
                >
                  <Text style={styles.saveChanges}>Save Changes</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          )}
        </KeyboardShift>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({

  userAvatar: {
    flex:1, 
    width: wPercentage('40%'), 
    height: hPercentage('40%'), 
    resizeMode: 'center'
  },

  titleRow: {
    flex: 1,
    flexDirection: "row",
    paddingTop: "5%",
    height: 70,
    width: "100%",
    backgroundColor: "rgba(249, 248, 248, 1)",
    borderBottomColor: "rgba(141, 130, 130, 1)",
    borderBottomWidth: 2
  },

  pageTitle: {
    height: 100,
    width: "50%",
    fontSize: 22,
    fontWeight: "600",
    color: "rgba(100, 92, 92, 0.8)" // Dark grey
  },

  editButton: {
    textAlign: "right",
    marginTop: 5,
    height: 100,
    marginLeft: 20,
    textDecorationLine: "underline"
  },

  inputHeading: {
    paddingTop: 30,
    paddingLeft: 30,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(163, 143, 143, 1)"
  },

  dataRow: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 30
    //alignItems: 'flex-start',
  },

  inputLabel: {
    width: 160,
    paddingTop: 10,
    fontSize: 15,
    color: "rgba(100, 92, 92, 1)",
    fontWeight: "500"
  },

  inputData: {
    width: 200,
    paddingTop: hPercentage('1%'),
  },

  inputDataBoxed: {
    width: wPercentage('40%'),
    marginTop: hPercentage("1%"),
    marginBottom: hPercentage("1%"),
    paddingTop: hPercentage("0.2%"),
    paddingBottom: hPercentage("0.2%"),
    paddingRight: wPercentage("2%"),
    paddingLeft: wPercentage("2%"),
    borderColor: "rgba(193, 201, 200, 1)",
    borderWidth: 1
  },

  macrosInputData:{
    marginTop: hPercentage('0.5%'),
    width: wPercentage('20%'),
  },

  macrosInputDataBoxed:{
    width: wPercentage('20%'),
    marginTop: hPercentage("1%"),
    marginBottom: hPercentage("1%"),
    paddingTop: hPercentage("0.2%"),
    paddingBottom: hPercentage("0.2%"),
    paddingRight: wPercentage("2%"),
    paddingLeft: wPercentage("2%"),
    borderColor: "rgba(193, 201, 200, 1)",
    borderWidth: 1,
    textAlign: ('center')
  },

  macroLabel: {
    width: 160,
    fontSize: 15,
    marginTop: hPercentage("1.7%"),
    marginBottom: hPercentage("1%"),
    color: "rgba(100, 92, 92, 1)",
    fontWeight: "500"
  },

  separationLine: {
    marginTop: 5,
    marginLeft: 30,
    width: "85%",
    borderBottomColor: "rgba(126, 104, 104, 0.3)", // Light Brown
    borderBottomWidth: 2
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  macroSeparationLine: {
    marginTop: 10,
    marginLeft: 30,
    width: "85%",
    borderBottomColor: "rgba(126, 104, 104, 0.3)", // Light Brown
    borderBottomWidth: 2
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  whitespaceBuffer: {
    marginBottom: hPercentage("2%")
  },

  saveButton: {
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("3%"),
    marginLeft: wPercentage("7%"),
    marginRight: wPercentage("7%"),
    paddingTop: hPercentage("1%"),
    paddingBottom: hPercentage("1%"),
    backgroundColor: "rgba(204, 102, 102, 0.9)",
    alignItems: "center",
    justifyContent: "center"
  },

  saveChanges: {
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    fontWeight: "600",
    width: "100%",
    textAlign: "center"
  },

  imageContainer: {
    flex: 1,
    marginTop: hPercentage("5%"),
    height: hPercentage("25%"),
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center"
  }
});
