import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Picker, Button, Alert, Dimensions } from 'react-native';
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
                    style={{width:330}}
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
                          marginLeft: 40
                        }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                />
                </View>
                
                <Text style={styles.inputLabel}>Height</Text>

                <View style={styles.row}>
                    <View style={styles.heightContainer}>
                        <TextInput
                            style={styles.input}
                            value = {this.state.height}
                            //onChangeText = {(text) => {this.setState( {height: text} ) } }
                        />
                    </View>
                    <View style={style={ backgroundColor: 'rgba(215, 203, 203, 0.35)', height: 40, width: 90}}>
                        <Picker style={styles.pickerContainer}
                                selectedValue={this.state.selectedHeightMetric}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedHeightMetric : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label="in" value="in" />
                            <Picker.Item style={styles.picker} label="cm" value="cm" />
                        </Picker>
                    </View>
                </View>

                <Text style={styles.inputLabel}>Weight</Text>
                
                <View style={styles.row}>
                
                    <View style={styles.heightContainer}>
                        <TextInput
                            style={styles.input}
                            value = {this.state.height}
                            //onChangeText = {(text) => {this.setState( {height: text} ) } }
                        />
                    </View>
                    <View style={{backgroundColor: 'rgba(215, 203, 203, 0.35)', height: 40,  width: 90}}>
                        <Picker style={styles.pickerContainer}
                                selectedValue={this.state.selectedHeightMetric}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedHeightMetric : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label="lbs" value="lbs" />
                            <Picker.Item style={styles.picker} label="kg" value="kg" />
                        </Picker>
                    </View>
                </View>


                <Text style={styles.inputLabel}>Activity Level</Text>
                <View style={styles.activityContainer}>
                    <Picker style={styles.activityRow}
                                selectedValue={this.state.selectedHeightMetric}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedHeightMetric : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label="Sedentary" value="0" />
                            <Picker.Item style={styles.picker} label="Lightly Active" value="1" />
                            <Picker.Item style={styles.picker} label="Active" value="2" />
                            <Picker.Item style={styles.picker} label="Very Active" value="3" />
                    </Picker>
                </View>   
                
                <TouchableOpacity style={styles.signupButton} onPress ={this.onSignUpPress}> 
                    <Text style={styles.signupText}>SIGN UP</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.loginButton} onPress ={this.onBackToLogin}> 
                    <Text>Back to Login</Text>
                </TouchableOpacity>


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
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        height: 40,
        fontSize: 15,
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
        backgroundColor: 'rgba(244, 238, 238, 0.5)', // Sandy 
    },
  
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'flex-start',
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        height: 40,
        backgroundColor: 'rgba(244, 238, 238, 0.7)',
    },

    activityRow: {
        flex: 1,
        flexDirection: "row",
        //alignItems: 'flex-start',
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 5,
        height: 40,
    },

    pickerContainer: {
        flex: 1,
    },
    

    heightContainer : {
        flex: 2,
        flexWrap: 'wrap',
        height: 40,
        marginLeft: 40,
    },

    activityContainer : {
        backgroundColor: 'rgba(244, 238, 238, 0.7)', 
        height: 40, 
        marginTop: 7,
        marginLeft: 40,
        marginRight: 40,
    },

    input: {
        width: WIDTH - 130,
        height: 40,
        fontSize: 15,
        marginLeft: -25, 
        //borderBottomColor: 'rgba(181, 83, 102, 1)', // Medium Pink
        //borderBottomWidth: 2,
    },

    signupButton: {
        marginTop: 40,
        marginBottom: 30,
        marginRight: 40,
        marginLeft: 40,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(204, 102, 102, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginButton: {
        marginBottom: 20,
        marginRight: 40,
        marginLeft: 40,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    signupText: {
        color: 'rgba(255, 255, 255, 1)',
        //fontWeight: '600',
    },
  });