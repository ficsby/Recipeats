import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Picker, Button, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';

import logo from './../../assets/images/logo_transparent.png';
import { stringify } from 'qs';

import KeyboardShift from './../../styles/KeyboardShift.js';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');

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
            editable: false,

            name : "someName",
            email: "someEmail",
            password: "somePw",
            username: "someUsername",
            height: "someHeight",
            weight: "someWeight",
            activityLevel: "someActivityLevel",
            birthDate: "someBirthday",

            calories: "1000",
            protein: "100",
            fats: "100",
            carbs: "100",

            budget: "2000 weekly"
        };
        this.toggleEditable = this.toggleEditable.bind(this);
        this.onSaveChangesPress = this.onSaveChangesPress.bind(this);
    }

    toggleEditable() {
        this.setState({
            editable: !this.state.editable
        });

        this.state.editable?  Alert.alert("Not editable now") : Alert.alert("Values should be editable now.");
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
            height: this.state.height

            // calories: this.state.calories,
            // protein: this.state.email,
            // fats: this.state.fats,
            // carbs: this.state.carbs,

            // budget: this.state.budget
        });
    }

    handleNaN = (text) => {
        Alert.alert("Please enter a number");
        text = text.substring(0, text.length - 1);
    }
    
    onSaveChangesPress = () => {
        Alert.alert("Saved... (Testing)");
        this.toggleEditable();
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
<<<<<<< HEAD
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
                                    value = {user.name} editable={false}/>
                        </View>
        
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.username} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.email} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
                
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.password} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
        
                        {/* PHYSICAL INFORMATION */}

                        <Text style={styles.inputHeading}>Your physical information</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Birthday</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.birthDate} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />

                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Gender</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.gender} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Height</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.height} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Weight</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.weight} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Level of Activity</Text>
                            <TextInput style={styles.inputData} 
                                    value ={user.activityLevel} editable={isEditable}/>
                        </View>
                        <View style={styles.separationLine} />
        
        
                        <Text style={styles.inputHeading}>Macro Goals</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Calories</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'1000'} editable={isEditable}/>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Protein</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={isEditable}/>                
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Fats</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={isEditable}/>                
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <TextInput style={{ width: 200}}
                                    value ={'100'} editable={isEditable}/>                
                        </View>
                        <View style={styles.macroSeparationLine} />
        
        
                        <Text style={styles.inputHeading}>Budget Information</Text>
        
                        <View style={styles.dataRow}>
                            <Text style={styles.inputLabel}>Budget</Text>
                            <TextInput style={styles.inputData} 
                                    value ={'$200 weekly'} editable={isEditable}/>                
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
=======
        
        return (
            <ScrollView>

                <View style={styles.titleRow}>
                    {/* Side bar navigation icon */}
                    <TouchableOpacity style={{height: 80}}>
                        <Icon name='left' size={30} color='rgba(100, 92, 92, 0.8)'
                              style={{marginLeft: '20%'}} />
                    </TouchableOpacity>

                    <Text style={styles.pageTitle}>Account Settings</Text>
                    {
                        !(this.state.editable)? 
                        <TouchableOpacity>
                            <Text style={styles.editButton} onPress ={this.toggleEditable}>Edit</Text>
                        </TouchableOpacity> : null
                    }
                </View>

                <Text style={styles.inputHeading}>Your basic information</Text>
 
                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.name}  onChangeText={(name) => this.setState({name})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.username}  onChangeText={(username) => this.setState({username})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.email}  onChangeText={(email) => this.setState({email})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />
        
                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.password}  onChangeText={(password) => this.setState({password})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />



                <Text style={styles.inputHeading}>Your physical information</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Birthday</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.birthDate}  onChangeText={(birthDate) => this.setState({birthDate})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Height</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.height}  onChangeText={(height) => this.setState({height})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Weight</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.weight}  onChangeText={(weight) => this.setState({weight})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Level of Activity</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.activityLevel}  onChangeText={(activityLevel) => this.setState({activityLevel})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.separationLine} />


                <Text style={styles.inputHeading}>Macro Goals</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <TextInput style={{ width: 200}}
                               value ={this.state.calories}  onChangeText={(calories) => this.setState({calories})}
                               editable={this.state.editable}/>
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <TextInput style={{ width: 200}}
                               value ={this.state.protein}  onChangeText={(protein) => this.setState({protein})}
                               editable={this.state.editable}/>                
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Fats</Text>
                    <TextInput style={{ width: 200}}
                               value ={this.state.fats}  onChangeText={(fats) => this.setState({fats})}
                               editable={this.state.editable}/>                
                </View>
                <View style={styles.dataRow}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <TextInput style={{ width: 200}}
                               value ={this.state.carbs}  onChangeText={(carbs) => this.setState({carbs})}
                               editable={this.state.editable}/>                
                </View>
                <View style={styles.macroSeparationLine} />


                <Text style={styles.inputHeading}>Budget Information</Text>

                <View style={styles.dataRow}>
                    <Text style={styles.inputLabel}>Budget</Text>
                    <TextInput style={styles.inputData} 
                               value ={this.state.budget}  onChangeText={(budget) => this.setState({budget})} 
                               editable={this.state.editable}/>                
                </View>                
                <View style={styles.separationLine} />
                <View style={styles.whitespaceBuffer} />
                {
                    this.state.editable?            
                    <TouchableOpacity style={styles.saveButton} onPress ={this.onSaveChangesPress}> 
                        <Text style={styles.saveChanges}>Save Changes</Text>
                    </TouchableOpacity> : null
                }
            </ScrollView>
        ) 
>>>>>>> master
    }
}

const styles = StyleSheet.create({
    
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

    editButton: {
        textAlign: 'right',
        marginTop: 5,
        height: 100,
        marginLeft: 20,
        textDecorationLine: 'underline',
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
        width: 160,
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

    whitespaceBuffer: {
        marginBottom: '10%',
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