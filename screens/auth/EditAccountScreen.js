import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Picker, Button, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';

import logo from './../../assets/images/logo_transparent.png';
import { stringify } from 'qs';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window')

export default class SignupScreen extends React.Component {
    //user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    
    user = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            return user;
          // User is signed in.
        } else {
          // No user is signed in.
            return null;
        }
      });
      
    constructor(props) {
        super(props);
        this.state = { 
            name : "",
            email: "",
            password: "",
            username: "",
            weight: "",
            activityLevel: "",
            birthDate: "",
            selectedHeightMetric : "",
        };
    }

    writeUserData = (userId) => {
        firebase.database().ref('users/' + userId).set({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            username: this.state.username,
            weight: this.state.weight,
            activityLevel: this.state.activityLevel,
            birthDate: this.state.birthDate,
            selectedHeightMetric: this.state.selectedHeightMetric
        });
    }

    handleNaN = (text) => {
        Alert.alert("Please enter a number");
        text = text.substring(0, text.length - 1);
    }

    onSaveChangesPress = () => {
        if(this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords do not match");
            return;
        }
        
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then( () => {
            var user = firebase.auth().currentUser;
            this.writeUserData(user.uid);
            user.sendEmailVerification(); 
            // do nothing, success of creating will move onto the main page
        }, (error) => {
            Alert.alert(error.message);
        });
    }

    onBackToHome = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "Home" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }

    render() {
        
        return (
            <ScrollView>

                <View style={styles.titleRow}>
                    {/* Side bar navigation icon */}
                    <TouchableOpacity style={{height: 80}}>
                        <Icon name='left' size={30} color='rgba(100, 92, 92, 0.8)'
                                style={{marginLeft: '20%'}} />
                    </TouchableOpacity>

                    <Text style={styles.pageTitle}>Account Settings</Text>
                </View>

                <Text style={styles.inputHeading}>Your basic information</Text>
 
                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <Text style={styles.inputData}>Frank Buendia</Text>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <Text style={styles.inputData}>jiggypuff</Text>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <Text style={styles.inputData}>frankbuendia@gmail.com</Text>
                </View>
                <View style={styles.separationLine} />
        
                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <Text style={styles.inputData}>********</Text>
                </View>
                <View style={styles.separationLine} />



                <Text style={styles.inputHeading}>Your physical information</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Birthday</Text>
                    <Text style={styles.inputData}>12/10/1997</Text>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Height</Text>
                    <Text style={styles.inputData}> --- </Text>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Weight</Text>
                    <Text style={styles.inputData}> --- </Text>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Level of Activity</Text>
                    <Text style={styles.inputData}> Sedentary </Text>
                </View>
                <View style={styles.separationLine} />


                <Text style={styles.inputHeading}>Macro Goals</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <Text style={{ width: 200}}> 2000 </Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={{ width: 200}}> 100 </Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Fats</Text>
                    <Text style={{ width: 200}}> 100 </Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={{ width: 200}}> 100 </Text>
                </View>
                <View style={styles.macroSeparationLine} />


                <Text style={styles.inputHeading}>Budget Information</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Budget</Text>
                    <Text style={styles.inputData}> $200.00 weekly </Text>
                </View>                
                
                <View style={styles.separationLine} />

                           
                <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                    <Text style={styles.saveChanges}>Save Changes</Text>
                </TouchableOpacity>
              
            </ScrollView>
        ) 
    }
}

const styles = StyleSheet.create({
    
    titleRow: {
        flex: 1,
        flexDirection: "row",
        paddingTop: '5%',
        height: 78,
        width: '100%',
        backgroundColor: 'rgba(249, 248, 248, 1)',
        borderBottomColor: 'rgba(141, 130, 130, 1)',
        borderBottomWidth: 2,
    },

    pageTitle: {
        width: '100%',
        fontSize: 24,
        fontWeight: '600',
        color: 'rgba(100, 92, 92, 0.8)', // Dark grey
    },

    inputHeading: {
        paddingTop: 30,
        paddingLeft: 30,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(163, 143, 143, 1)',
    },

    dataRow: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 30,
        //alignItems: 'flex-start',
    },

    inputLabel: {
        width: 160,
        paddingTop: 10,
        fontSize: 15,
        color: 'rgba(100, 92, 92, 1)',
        fontWeight: '500',
    },

    inputData: {
        width: 200,
        paddingTop: 10,
    },

    macroLabel: {
        width: 200,
        fontSize: 15,
        color: 'rgba(100, 92, 92, 1)',
        fontWeight: '500',
    },

    separationLine: {
        marginTop: 5,
        marginLeft: 30,
        width: '85%',
        borderBottomColor: 'rgba(126, 104, 104, 0.3)', // Light Brown
        borderBottomWidth: 2,
        //alignItems: 'center',
        //justifyContent: 'center',
    },

    macroSeparationLine: {
        marginTop: 10,
        marginLeft: 30,
        width: '85%',
        borderBottomColor: 'rgba(126, 104, 104, 0.3)', // Light Brown
        borderBottomWidth: 2,
        //alignItems: 'center',
        //justifyContent: 'center',
    },

    saveButton: {
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(204, 102, 102, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    saveChanges: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontweight: '600',
    },


  });