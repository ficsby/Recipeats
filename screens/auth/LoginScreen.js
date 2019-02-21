import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { Font } from 'expo';
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
            fontLoaded: false,
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
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true})
    }
    
    render() {
        return (
            <View style={ globalStyles.background }>

                <Text>Login</Text>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Username'}
                        placeholderTextColor = {'rgba(0, 0, 0, 0.3)'}
                        value = {this.state.email}
                        onChangeText = {(text) => {this.setState( {email: text} ) } }
                        //underLineColorAndroid= 'transparent'
                    />
                </View>

                <View style={[styles.inputContainer, styles.inputContainer2]}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Password'}
                        placeholderTextColor = {'rgba(0, 0, 0, 0.3)'}
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
        marginTop: -60, 
        fontFamily: 'dancing-script',
        fontSize: 45,
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 50,

    },

    inputContainer: {
        marginTop: -50,
        flex: 1,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center' // Used to set Text Component Horizontally Center
    },

    inputContainer2: {
        marginTop: -100,
    },

    input: {
        width: WIDTH - 130,
        height: 40,
        fontSize: 20, 
        marginHorizontal: 35,
        marginTop: 100,
        borderBottomColor: 'rgba(181, 83, 102, 1)', // Medium Pink
        borderBottomWidth: 2,
    },

    button: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});