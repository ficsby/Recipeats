import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";
import { StackActions } from "react-navigation";
import * as firebase from "firebase";

export default class ExpensesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  // function for when user clicks the 'Reset Password Button'
  onResetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(
        () => {
          Alert.alert("Password reset email has been sent.");
        },
        error => {
          Alert.alert(error.message);
        }
      );
  };

  // function for when user clicks the 'Back to Login Button'
  onBackToLogin = () => {
    var navActions = StackActions.reset({
      index: 0,
      actions: [StackActions.push({ routeName: "Login" })]
    });

    this.props.navigation.dispatch(navActions);
  };

  render() {
    return (
      <View>
        <Text>Expenses Screen</Text>
      </View>
    );
  }
}