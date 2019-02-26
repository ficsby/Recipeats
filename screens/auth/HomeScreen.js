import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import { Font } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';

const { width: WIDTH } = Dimensions.get('window')
var globalStyles = require('./../../styles/globalStyles.js');

export default class HomeScreen extends React.Component {
    
    state = {
        search: '',
    };
    
    updateSearch = search => {
        this.setState({ search });
    };
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true})
    }

    render() {

        const { search } = this.state;

        return (
            <View>

                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>

                    <SearchBar placeholder="Search recipes, ingredients..."
                               onChangeText={this.updateSearch}
                               value={search}
                    />
                </View>
            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 238, 238, 0.7)',
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