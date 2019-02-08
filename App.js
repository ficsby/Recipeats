import React from 'react';
import { StyleSheet, Image, Text, TextInput, View, ScrollView, Dimensions } from 'react-native';
import f_base from './config/Firebase';

import logo from './images/logo.png';

const { width: WIDTH } = Dimensions.get('window')

export default class App extends React.Component {
  render() {
    return (
      <View>
        
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo}/>
          <Text>RECIPEATS</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Username'}
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            //underLineColorAndroid= 'transparent'
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            secureTextEntry ={true}
            placeholderTextColor = {'rgba(255, 255, 255, 0.7)'}
            //underLineColorAndroid= 'transparent'
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 50,
    alignItems: 'center'
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 50
  },

  inputContainer: {
    marginTop: 10
  },

  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16, 
    paddingLeft: 45,
    marginHorizontal: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: 'rgba(255, 255, 255, 0.7)'
  }
});
