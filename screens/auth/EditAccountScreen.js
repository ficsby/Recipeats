import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Picker, Button, Alert, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import {AsyncStorage} from 'react-native';

import logo from './../../assets/images/logo_transparent.png';
import { stringify } from 'qs';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');

export default class SignupScreen extends React.Component {
    //user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    constructor(props) {
        super(props);
        this.state = { 
            user: null,
            editable: false,
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

    componentDidMount() {
        this._ismounted = true;
        retrieveData = () => {
            ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
            return ref.once("value");
        }

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
        this._ismounted = false;
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
        var user = firebase.auth().currentUser;
        this.writeUserData(user.uid);
        Alert.alert("Your changes has been updated..");
    }

    onGoBack = () => {
        var navActions = StackActions.pop({
            n: 1,
        });
        
        this.props.navigation.dispatch(navActions);
    }

    render() {
        const { user } = this.state;
        const { isEditable } = this.state.editable;
        if(this._ismounted)
        {
            return (
                <ScrollView>
                    <View style={styles.titleRow}>
                        {/* Side bar navigation icon */}
                        <TouchableOpacity style={{height: 80}} onPress={this.onGoBack}>
                            <Icon name='left' size={30} color='rgba(100, 92, 92, 0.8)'
                                    style={{marginLeft: '20%'}}/>
                        </TouchableOpacity>
    
                        <Text style={styles.pageTitle}>Account Settings</Text>
    
                        <TouchableOpacity>
                            <Text style={styles.editButton} onPress ={this.onEditPress}>Edit</Text>
                        </TouchableOpacity>
    
                    </View>
    
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
    
    
    
                    <Text style={styles.inputHeading}>Your physical information</Text>
    
                    <View style={styles.dataRow}>
                        <Text style={styles.inputLabel}>Birthday</Text>
                        <TextInput style={styles.inputData} 
                                   value ={user.birthDate} editable={isEditable}/>
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
            )
        }
        else{
            return null;
        }
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
        fontWeight: '600',
    },

    deleteAccount: {
        marginTop: 20,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    deleteAccountText: {
        fontSize: 15,
        fontWeight: '500',
    }


  });