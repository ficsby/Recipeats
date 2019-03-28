import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image,  Dimensions, TouchableOpacity, Alert } from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class BudgetScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
        };
    }

    // function for when user clicks the 'Reset Password Button'
    onResetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then( () => {
            Alert.alert("Password reset email has been sent.");
        }, (error) => {
            Alert.alert(error.message);
        });
    }

    // function for when user clicks the 'Back to Login Button'
    onBackToLogin = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "Login" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }

    render() {
        
        return (
            <View>
                <Text>Budget Screen</Text>
            </View>
        )
     
    }
}

const styles = StyleSheet.create({
    pageTitle: {
        marginTop: hPercentage('15%'),
        marginLeft: 40,
        marginRight: 40,
        fontSize: 25,
        color: 'rgba(182, 93, 93, 0.8)',
    },
    
    subTitle: {
        marginTop: hPercentage('5%'),
        marginLeft: 40,
        marginRight: 40,
        fontSize: 15,
        color: 'rgba(121, 107, 107, 1)',
    },

    input: {
        fontSize: 15,
        color: 'rgba(0,0,0,1)',
    },

    inputContainer: {
        marginTop: hPercentage('5%'),
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 8,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
        backgroundColor: 'rgba(200, 125, 125, 0.2)',
    },

    resetPwButton: {
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('5%'),
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: 'rgba(190, 75, 75, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    resetPwText: {
        width: '100%',
        color: 'rgba(255,255,255,1)',
        fontSize: 15,
        textAlign: 'center',
    },

    loginText: {
        marginTop: 10,
        width: '100%',
        color: 'rgba(0,0,0,0.45)',
        fontSize: 13,
        textAlign: 'center',
    },
  });