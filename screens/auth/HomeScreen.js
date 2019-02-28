import React from 'react';
import { StyleSheet, Button, Image, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { SearchBar, Icon } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import * as firebase from 'firebase';

import logo from './../../assets/images/logo_transparent.png';
import { reset } from 'expo/build/AR';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon_font.json';
const CustomIcon = createIconSetFromFontello(fontelloConfig);

const { width: WIDTH } = Dimensions.get('window');
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
        this.setState({fontLoaded: true});
    };

    render() {

        const { search } = this.state;

        return (
            <View>

                <View style={styles.topContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText} >Recipeats</Text>

                    <SearchBar placeholder="Search recipes, ingredients..."
                               lightTheme={true}
                               round={true}
                               containerStyle={styles.searchContainer}
                               inputContainerStyle={styles.searchInputContainer}
                               inputStyle={styles.searchInput}
                               onChangeText={this.updateSearch}
                               value={search}
                    />
                </View>
                
                <View style={styles.newsfeedContainer}> 

                </View>

                <View style={styles.bottomMenuContainer}> 
                    <TouchableOpacity style={{width: '20%', height: 100, backgroundColor: 'powderblue'}}>
                        <Icon name='home' type='font-awesome' size={50} color='rgba(175,76,99,1)' onPress={() => console.log('You clicked on HOME')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{width: '20%', height: 100, backgroundColor: 'blue'}}>
                        <CustomIcon name='chef-cooker-hat' size={39} color='rgba(175,76,99,1)'/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{width: '20%', height: 100, backgroundColor: 'black'}}>
                        {/* <CustomIcon name="money" size={39} color='rgba(175,76,99,1)'/> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={{width: '20%', height: 100, backgroundColor: 'red'}}>
                        {/* <CustomIcon name="shopping-basket" size={39} color='rgba(175,76,99,1)'/> */}
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{width: '20%', height: 100, backgroundColor: 'green'}}>
                        {/* <CustomIcon name="book-alt" size={39} color='rgba(175,76,99,1)'/> */}
                    </TouchableOpacity>
                </View>
                            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
    }
}

const styles = StyleSheet.create({
    topContainer: {
        paddingTop: 20,
        paddingBottom: 26,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 238, 238, 0.5)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },
    
    logoText: {
        marginTop: -60,
        marginBottom: 15,
        fontFamily: 'dancing-script',
        fontSize: 45,
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 50,
    },

    searchContainer: {
        backgroundColor: 'white',
        height: 45,
        width: '70%',
    },

    searchInputContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: -5,
    },

    searchInput: {
        fontSize: 15,
    },

    newsfeedContainer: {
        backgroundColor: 'rgba(215, 215, 215, 0.2)',
        height: '65%',
    },

    bottomMenuContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    /*
    menuIcon: {
       
    },
    */
});