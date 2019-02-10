import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';

const { width: WIDTH } = Dimensions.get('window')
var globalStyles = require('./../../styles/globalStyles.js');

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
        };
    }

    onLoginPress = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then( () => {

        }, (error) => {
            Alert.alert(error.message);
        });
    }

    onSignUpPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "Signup" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }

    onForgotPasswordPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "ForgotPassword" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }

    render() {
        return (
            <View style={ globalStyles.background }>

                <Text>Login</Text>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >RECIPEATS</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'email'}
                        //placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
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
                    />
                </View>

                <TouchableOpacity style={styles.button } onPress={this.onLoginPress}>
                    <Text>Login</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button} onPress ={this.onSignUpPress}> 
                    <Text>Sign Up</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button} onPress ={this.onForgotPasswordPress}> 
                    <Text>Forgot Password</Text>
                 </TouchableOpacity>

            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        marginTop: 50,
        alignItems: 'center',
      },
    
    logoText: {
        marginTop: -40, 
        fontSize: 16,
    },

    logo: {
    width: 120,
    height: 120,
    marginBottom: 50,

    },

    inputContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(249, 248, 248, 1)',
    },

    input: {
    width: WIDTH - 75,
    height: 65,
    fontSize: 20, 
    paddingLeft: 45,
    marginHorizontal: 35,
    },

    button: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});