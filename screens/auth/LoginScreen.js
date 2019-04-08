import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import { Font } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { Styles } from './../../styles/GlobalStyles';

import KeyboardShift from './../../styles/KeyboardShift.js';

const { width: WIDTH } = Dimensions.get('window')

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            fontLoaded: false,
        };
    }

    // function for when user clicks the 'Login Button'
    onLoginPress = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then( () => {
            this.props.navigation.navigate('Home');
        }, (error) => {
            Alert.alert(error.message);
        });
    }

    // function for when user clicks the 'Signup Button'
    onSignUpPress = () => {
        this.props.navigation.navigate('Signup');
    }

    // function for when user clicks the 'Forgot Password Button'
    onForgotPasswordPress = () => {
        this.props.navigation.navigate('ForgotPassword');
    }

    /* NOTE: THIS IS FOR TESTING PURPOSES ONLY....  
             Normally you access this page through logging in with your credentials 
    */ 
    onHomePress = () => {
        this.props.navigation.goBack();
    }
    
    async componentDidMount() {
        this._isMounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true

        // load font first before using it
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        if (this._isMounted) this.setState({fontLoaded: true})
    }
    
    componentWillUnmount(){
        this._isMounted = false; // after components is unmounted reset boolean
    }

    render() {
        return (
            <View style={ Styles.background }>

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
        marginTop: hPercentage('40%'),
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