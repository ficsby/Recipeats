import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { Font } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';

const { width: WIDTH } = Dimensions.get('window')
var globalStyles = require('./../../styles/globalStyles.js');

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            fontLoaded: false,
        };
    }
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true})
    }
    
    render() {
        return (
            <View>

                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>
                </View>
            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        marginTop: -50,
        alignItems: 'center',
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