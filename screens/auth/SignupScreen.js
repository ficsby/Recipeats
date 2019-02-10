import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';

export default class SignupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            paswword: "",
            passwordConfirm: "",

        };
    }

    onSignUpPress = () => {

        if(this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords do not match");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then( ()=> {
            // do nothing, success of creating will move onto the main page
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
        
                <Text>Sign Up</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'email'}
                        value = {this.state.email}
                        onChangeText = {(text) => {this.setState( {email: text} ) } }
                        //underLineColorAndroid= 'transparent'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'password'}
                        secureTextEntry ={true}
                        value = {this.state.password}
                        onChangeText = {(text) => {this.setState( {password: text} ) } }
                        //underLineColorAndroid= 'transparent'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'passwordConfirm'}
                        secureTextEntry ={true}
                        value = {this.state.passwordConfirm}
                        onChangeText = {(text) => {this.setState( {passwordConfirm: text} ) } }
                        //underLineColorAndroid= 'transparent'
                    />
                </View>

                <TouchableOpacity style={styles.button } onPress={this.onSignUpPress}>
                    <Text>Sign Up</Text>
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