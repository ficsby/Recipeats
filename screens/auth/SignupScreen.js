import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';

const { width: WIDTH } = Dimensions.get('window')

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
            <ScrollView>
        
                <Text style={styles.pageTitle}>Sign Up</Text>


                <Text style={styles.inputHeading}>Your basic information</Text>

                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.name}
                        //onChangeText = {(text) => {this.setState( {name: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.username}
                        //onChangeText = {(text) => {this.setState( {username: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.email}
                        //onChangeText = {(text) => {this.setState( {email: text} ) } }
                    />
                </View>
                
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.password}
                        //onChangeText = {(text) => {this.setState( {password: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Password Confirmation</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.passwordConfirm}
                        //onChangeText = {(text) => {this.setState( {passwordConfirm: text} ) } }
                    />
                </View>


                <Text style={styles.inputHeading}>Your physical information</Text>

                <Text style={styles.inputLabel}>Birthday</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.birthday}
                        //onChangeText = {(text) => {this.setState( {birthday: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Height</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.height}
                        //onChangeText = {(text) => {this.setState( {height: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Weight</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.name}
                        //onChangeText = {(text) => {this.setState( {name: text} ) } }
                    />
                </View>

            </ScrollView>
        )
     
    }
}

const styles = StyleSheet.create({

    pageTitle: {
        paddingTop: 30,
        fontSize: 35,
        textAlign: 'center',
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    inputHeading: {
        paddingTop: 30,
        paddingLeft: 40,
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(91, 88, 88, 0.9)',
    },

    inputLabel: {
        marginBottom: -5,
        paddingLeft: 40,
        fontSize: 15,
        color: 'rgba(91, 88, 88, 0.9)',
    },

    inputContainer: {
        paddingTop: 7,
        paddingBottom: 7,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        fontSize: 15,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
        backgroundColor: 'rgba(244, 238, 238, 0.7)', // Sandy 
    },

    input: {
        width: WIDTH - 130,
        height: 40,
        fontSize: 20, 
        marginHorizontal: 35,
        //borderBottomColor: 'rgba(181, 83, 102, 1)', // Medium Pink
        //borderBottomWidth: 2,
    },

    button: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });