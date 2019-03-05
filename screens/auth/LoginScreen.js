import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import { Font } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';
import { heightPercentageToDP } from 'react-native-responsive-screen';

import KeyboardShift from './../../styles/KeyboardShift.js'

const { width: WIDTH } = Dimensions.get('window')
var globalStyles = require('./../../styles/globalStyles.js');

export default class LoginScreen extends React.Component {
    _isMounted = false;

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

    /* NOTE: THIS IS FOR TESTING PURPOSES ONLY....  
             Normally you access this page through logging in with your credentials 
    */ 
    onHomePress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "Home" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }
    
    async componentDidMount() {
        this._isMounted = true;
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        if (this._isMounted) this.setState({fontLoaded: true})
    }
    
    componentWillUnmount(){
        this._isMounted = false;
    }

    render() {
        return (
            <View style={ globalStyles.background }>

                <Text>Login</Text>

                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>
                </View>

                <KeyboardShift>
                {() => (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Username'}
                        placeholderTextColor = {'rgba(0, 0, 0, 0.3)'}
                        value = {this.state.email}
                        onChangeText = {(text) => {
                            if (this._isMounted) this.setState( {email: text} ) 
                        } }
                        //underLineColorAndroid= 'transparent'
                    />

                    <TextInput
                        style={styles.input}
                        placeholder={'Password'}
                        placeholderTextColor = {'rgba(0, 0, 0, 0.3)'}
                        secureTextEntry ={true}
                        value = {this.state.password}
                        onChangeText = {(text) => { 
                            if (this._isMounted) this.setState( {password: text} ) 
                        } }
                    />
                </View>
                )}
            </KeyboardShift>

                <TouchableOpacity style={styles.loginButton } onPress={this.onLoginPress}>
                    <Text>Login</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.signUpButton} onPress ={this.onSignUpPress}> 
                    <Text>Sign Up</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.forgotPasswordButton} onPress ={this.onForgotPasswordPress}> 
                    <Text>Forgot Password</Text>
                 </TouchableOpacity>
            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        marginTop: hPercentage('5%'),
        alignItems: 'center',
      },
      
    logoText: {
        marginTop: hPercentage('0%'), 
        fontFamily: 'dancing-script',
        fontSize: 45,
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    logo: {
        marginTop: hPercentage('1%'),
        width: 90,
        height: 90,

    },

    inputContainer: {
        marginTop: hPercentage('-5%'),
        flex: 1,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center' // Used to set Text Component Horizontally Center
    },

    inputContainer2: {
        marginTop: hPercentage('-5%'),
        marginBottom: hPercentage('5%'),
    },

    input: {
        marginTop: 100,
        width: WIDTH - 130,
        height: 40,
        fontSize: 20, 
        marginHorizontal: 35,
        marginTop: hPercentage('5%'),
        borderBottomColor: 'rgba(181, 83, 102, 1)', // Medium Pink
        borderBottomWidth: 2,
    },

    loginButton: {
        marginTop: hPercentage('30%'),
        marginBottom: hPercentage('7%'),
        alignItems: 'center',
        justifyContent: 'center',
    },

    signUpButton: {
        marginBottom: hPercentage('7%'),
        alignItems: 'center',
        justifyContent: 'center',
    },

    forgotPasswordButton: {
        marginBottom: hPercentage('10%'),
        alignItems: 'center',
        justifyContent: 'center',
    },

});