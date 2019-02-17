import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Button, Picker, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';

import logo from './../../assets/images/logo_transparent.png';

const { width: WIDTH } = Dimensions.get('window')

export default class SignupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            name : "",
            email: "",
            paswword: "",
            passwordConfirm: "",
            username: "",
            selectedHeightMetric : "",
        };
    }
    onSignUpPress = () => {
        if(this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords do not match");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then( function(user) {
            var ref = firebase.database().ref().child("user");
            var data = {
                email: this.email,
                password: this.password,
                name: this.name,
                id: user.uid
            }
            ref.child(user.uid).set(data).then(function(ref) {//use 'child' and 'set' combination to save data in your own generated key
                console.log("Saved");
                $location.path('/profile');
            }, function(error) {
                console.log(error); 
            });
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
                        onChangeText = { (text) => {this.setState( {name: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.username}
                        onChangeText = {(text) => {this.setState( {username: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.email}
                        onChangeText = {(text) => {this.setState( {email: text} ) } }
                    />
                </View>
                
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.password}
                        onChangeText = {(text) => {this.setState( {password: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Password Confirmation</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry ={true}
                        value = {this.state.passwordConfirm}
                        onChangeText = {(text) => {this.setState( {passwordConfirm: text} ) } }
                    />
                </View>


                <Text style={styles.inputHeading}>Your physical information</Text>

                <Text style={styles.inputLabel}>Birthday</Text>

                <View style={styles.inputDate}>
                <DatePicker
                    style={{width:200}}
                    date={this.state.date}
                    mode="date"
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    minDate='1900-01-01'
                    maxDate='2020-12-31'
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0
                        },
                        dateInput: {
                          marginLeft: 36
                        }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                />
                </View>
                
                <Text style={styles.inputLabel}>Height</Text>

                <View style={styles.row}>
                
                    <View style={styles.heightContainer}>
                        <TextInput
                            style={styles.bodyInfoInput}
                            value = {this.state.height}
                            //onChangeText = {(text) => {this.setState( {height: text} ) } }
                        />
                    </View>
                    <Picker style={styles.pickerContainer}
                            selectedValue={this.state.selectedHeightMetric}
                            onValueChange={ (itemValue, itemIndex) => this.setState({selectedHeightMetric : itemValue }) }
                            mode = {'dropdown'}>

                        <Picker.Item style={styles.picker} label="ft" value="ft" />
                        <Picker.Item style={styles.picker} label="in" value="in" />
                        <Picker.Item style={styles.picker} label="cm" value="cm" />
                    </Picker>
                </View>

                <Text style={styles.inputLabel}>Weight</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.name}
                        //onChangeText = {(text) => {this.setState( {weight: text} ) } }
                    />
                </View>

                <Text style={styles.inputLabel}>Activity Level</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value = {this.state.name}
                        //onChangeText = {(text) => {this.setState( {activityLevel: text} ) } }
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
        marginBottom: 5,
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(91, 88, 88, 0.9)',
    },

    inputLabel: {
        marginBottom: -5,
        paddingLeft: 40,
        paddingTop: 10,
        fontSize: 15,
        color: 'rgba(91, 88, 88, 0.9)',
    },

    inputDate:  {
        marginBottom: 5,
        paddingLeft: 40,
        paddingTop: 10,
        fontSize: 15,
        color: 'rgba(91, 88, 88, 0.9)',
    },

    inputContainer: {
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        fontSize: 15,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
        backgroundColor: 'rgba(244, 238, 238, 0.7)', // Sandy 
    },
  
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'flex-start',
    },

    pickerContainer: {
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
    },

    heightContainer : {
        flex: 2,
        flexWrap: 'wrap',
        marginLeft: 40,
        marginRight: 40,
    },

    bodyInfoInput: {
        flex: 1,
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

    input_col: {
        width: 50,
        height: 50,
        fontSize: 15,
        backgroundColor: 'rgba(244, 238, 238, 0.7)', // Sandy 
    },

    metric_col: {
        width: 50,
        height: 50,
    },

    button: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });