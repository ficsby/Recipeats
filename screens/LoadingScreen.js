import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
//import {TextLoader} from 'react-native-indicator';

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
        marginTop: -100,
        justifyContent: 'center'
    },

});