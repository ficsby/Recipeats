import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
    widthPercentageToDP as wPercentage,
    heightPercentageToDP as hPercentage
  } from "react-native-responsive-screen";
import { UIActivityIndicator } from 'react-native-indicators';
import logo from './../assets/images/logo_transparent.png';

export default class LoadingScreen extends React.Component {
    render(){
        return(
            <View style={styles.loadingIndicator}>
                <UIActivityIndicator color='rgba(153, 86, 86, 0.45)' size={50}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    loadingIndicator: {
        flex: 1,
        marginTop: hPercentage('-10%'),
        justifyContent: 'center'
    },

});