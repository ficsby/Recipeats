import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
<<<<<<< HEAD
import { SearchBar } from 'react-native-elements';
=======
>>>>>>> 01ea5e1f767be60e47f1fad9e9c22266d22d0730
import { Font } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';

const { width: WIDTH } = Dimensions.get('window')
var globalStyles = require('./../../styles/globalStyles.js');

<<<<<<< HEAD
export default class HomeScreen extends React.Component {
    
    state = {
        search: '',
    };
    
    updateSearch = search => {
        this.setState({ search });
    };
=======
export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            fontLoaded: false,
        };
    }
>>>>>>> 01ea5e1f767be60e47f1fad9e9c22266d22d0730
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true})
    }
<<<<<<< HEAD

    render() {

        const { search } = this.state;

=======
    
    render() {
>>>>>>> 01ea5e1f767be60e47f1fad9e9c22266d22d0730
        return (
            <View>

                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>
<<<<<<< HEAD

                    <SearchBar placeholder="Search recipes, ingredients..."
                               onChangeText={this.updateSearch}
                               value={search}
                    />
=======
>>>>>>> 01ea5e1f767be60e47f1fad9e9c22266d22d0730
                </View>
            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    logoContainer: {
<<<<<<< HEAD
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 238, 238, 0.7)',
=======
        marginTop: -50,
        alignItems: 'center',
>>>>>>> 01ea5e1f767be60e47f1fad9e9c22266d22d0730
      },
    
    logoText: {
        marginTop: -60, 
        fontFamily: 'dancing-script',
        fontSize: 45,
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 50,

    },
});