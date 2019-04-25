import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';

import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

import KeyboardShift from './../../styles/KeyboardShift.js';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

export default class EditAccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: null,
            editable: false,
        };
        this.toggleEditable = this.toggleEditable.bind(this);
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
    }

    //  Toggles whether the information is editable by the user.
    //  User is only able to edit after clicking on the edit button
    toggleEditable() {
        this.setState({
            editable: !this.state.editable
        });
    }

    onSaveChangesPress = () => {
        Alert.alert("Saved... (Testing)");
        this.toggleEditable();
    }

    componentDidMount() {
        this._ismounted = true; // Set boolean to true, then for each setState call have a condition that checks if _ismounted is true

        // Returns a promise of the user's value
        retrieveData = () => {
            ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
            return ref.once("value");
        }

        // Snapshot is the depiction of the user's current data
        retrieveData().then( (snapshot) => {
            if(this._ismounted)
            {
                this.setState( {
                    user: snapshot.val()
                })
            }
        })
    }

    
    componentWillUnmount () {
        this._ismounted = false; // After components is unmounted reset boolean
     }
    
    // Writes user data to the database
    writeUserData = (userId) => {
        firebase.database().ref('users/' + userId).set({
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username,
            weight: user.weight,
            activityLevel: user.activityLevel,
            birthDate: user.birthDate,
            selectedHeightMetric: user.selectedHeightMetric,
            selectedGender: user.selectedGender
        });
    }

    // Handles not a number exception
    handleNaN = (text) => {
        Alert.alert("Please enter a number");
        text = text.substring(0, text.length - 1);
    }
    
    // Function for when user clicks the 'Save Button'
    onSaveChangesPress = () => {
        var user = firebase.auth().currentUser;
        this.writeUserData(user.uid);
        Alert.alert("Your changes has been updated..");
    }

    // Function for when user clicks the 'Arrow back Button'
    onGoBack = () => {
        // To go back to previous screen pop the current screen
        var navActions = StackActions.pop({
            n: 1,   // n is number of screens to pop
        });
        
        this.props.navigation.dispatch(navActions);
    }

    render() {
        const { user } = this.state;
        const { isEditable } = this.state.editable;
        if(this._ismounted)
        {
            return (
                <KeyboardShift>
                {() => (
                    <ScrollView>
                        <View style={styles.titleRow}>
                            {/* Left Arrow Button (Goes back to previous page) */}
                            <TouchableOpacity style={{height: 80}} onPress={this.onGoBack}>
                                <Icon name='left' size={30} color='rgba(100, 92, 92, 0.8)'
                                        style={{marginLeft: '20%'}}/>
                            </TouchableOpacity>
        
                            <Text style={styles.pageTitle}>Account Settings</Text>
        
                            {/* Edit Button (When pressed, makes the information content editable) */}
                            <TouchableOpacity>
                                <Text style={styles.editButton} onPress ={this.toggleEditable}>Edit</Text>
                            </TouchableOpacity>
        
                        </View>


                        {/* BASIC USER INFORMATION */}

                        <Text style={styles.inputHeading}>Your basic information</Text>
                        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput style={styles.inputData} 
                                    value = {user.name} onChangeText={(name) => this.setState({name})} 
                                    editable={this.state.editable}/>
                        </View>
        
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.username} onChangeText={(username) => this.setState({username})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.email} onChangeText={(email) => this.setState({email})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />
                
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.password} onChangeText={(password) => this.setState({password})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />
        
        
                        {/* PHYSICAL INFORMATION */}

                        <Text style={styles.inputHeading}>Your physical information</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Birthday</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.birthDate} onChangeText={(birthDate) => this.setState({birthDate})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />

                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Gender</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.selectedGender} onChangeText={(selectedGender) => this.setState({selectedGender})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Height</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.height} onChangeText={(height) => this.setState({height})} 
                                    editable={this.state.editable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Weight</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.weight} onChangeText={(weight) => this.setState({weight})} 
                                    editable={this.state.editable}/>
                        </View>

                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Level of Activity</Text>
                            
                            <TextInput style={styles.inputData} 
                                    value ={user.activityLevel} onChangeText={(activityLevel) => this.setState({activityLevel})} 
                                    editable={this.state.editable}/>
                        </View>

                        <View style={styles.separationLine} />
        
        
                        <Text style={styles.inputHeading}>Macro Goals</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Calories</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'1000'} editable={this.state.editable}/>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Protein</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={this.state.editable}/>                
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Fats</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={this.state.editable}/>                
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={this.state.editable}/>                
                        </View>
                        <View style={styles.macroSeparationLine} />
        
        
                        <Text style={styles.inputHeading}>Budget Information</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Budget</Text>
                            <TextInput style={styles.inputData} 
                                    value ={'$200 weekly'} editable={this.state.editable}/>                
                        </View>                
                        <View style={styles.separationLine} />
        
                                
                        <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                            <Text style={styles.saveChanges}>Save Changes</Text>
                        </TouchableOpacity>
                    
                    </ScrollView>
                )}
                </KeyboardShift>
            )
        }
        else{
            return null;
        }
    }
}

const styles = StyleSheet.create({

 /*------------------------------------------------------------------------
    Top Section
------------------------------------------------------------------------*/
    
    titleRow: {
        flex: 1,
        flexDirection: "row",
        paddingTop: '5%',
        height: 70,
        width: '100%',
        backgroundColor: 'rgba(249, 248, 248, 1)',
        borderBottomColor: 'rgba(141, 130, 130, 1)',
        borderBottomWidth: 2,
    },

    pageTitle: {
        height: 100,
        width: '50%',
        fontSize: 22,
        fontWeight: '600',
        color: 'rgba(100, 92, 92, 0.8)', // Dark grey
    },

 /*------------------------------------------------------------------------
    Information Section
------------------------------------------------------------------------*/

    dataRow: {
        flex: 1,
        flexDirection: "row",
        marginLeft: wPercentage('7%'),
    },

    inputHeading: {
        paddingTop: 30,
        paddingLeft: 30,
        marginBottom: hPercentage('2%'),
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(163, 143, 143, 1)',
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
        width: 160,
        fontSize: 15,
        color: 'rgba(100, 92, 92, 1)',
        fontWeight: '500',
    },

    separationLine: {
        marginTop: hPercentage('1%'),
        marginLeft: wPercentage('7%'),
        width: '85%',
        borderBottomColor: 'rgba(126, 104, 104, 0.3)', // Light Brown
        borderBottomWidth: 2,
    },

    macroSeparationLine: {
        marginTop: hPercentage('1%'),
        marginLeft: wPercentage('7%'),
        width: '85%',
        borderBottomColor: 'rgba(126, 104, 104, 0.3)', // Light Brown
        borderBottomWidth: 2,
    },

 /*------------------------------------------------------------------------
    Buttons
------------------------------------------------------------------------*/
            
    editButton: {
        textAlign: 'right',
        marginTop: 5,
        height: 100,
        marginLeft: 20,
        textDecorationLine: 'underline',
    },

    saveButton: {
        marginTop: hPercentage('5%'),
        marginBottom: hPercentage('5%'),
        marginLeft: wPercentage('7%'),
        marginRight: wPercentage('7%'),
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(204, 102, 102, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    saveChanges: {
        color: 'rgba(255,255,255,1)',
        fontSize: 16,
        fontWeight: '600',
    },

});