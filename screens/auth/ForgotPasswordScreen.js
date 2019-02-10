import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';

export default class SignupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
        };
    }

    onResetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then( () => {
            Alert.alert("Password reset email has been sent.");
        }, (error) => {
            Alert.alert(error.message);
        });
    }

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
        
                <Text>Forgot Password</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'email'}
                        value = {this.state.email}
                        onChangeText = {(text) => {this.setState( {email: text} ) } }
                        //underLineColorAndroid= 'transparent'
                    />
                </View>

                
                <TouchableOpacity style={styles.button } onPress={this.onResetPassword}>
                    <Text>Reset Password</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button} onPress ={this.onBackToLogin}> 
                    <Text>Back to Login</Text>
                 </TouchableOpacity>
            </View>
        )
     
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });