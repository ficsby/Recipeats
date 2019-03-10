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
    
    onDeleteAccount = () => {
        Alert.alert("Your account has been removed.");
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
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.deleteAccount} onPress ={this.onDeleteAccount}> 
                        <Text style={styles.deleteAccountText}>Delete your account </Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        ) 
    }
}

const styles = StyleSheet.create({
    


  });