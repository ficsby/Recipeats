import React from 'react';
import {SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, Text, Modal, Alert} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Font } from 'expo';
import NavigationService from './NavigationService';
import SearchScreen from './../screens/SearchScreen';
import ApiUtils from './../api/apiUtils';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';

const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('./../styles/GlobalStyles.js');

export default class SearchHeaderNav extends React.Component {
    
    state = {
        visible: NavigationService.getModalVisibility(),
        modalVisible: false,
        query: '',
        recipes: [],
        recipeTitle: '',
        recipeId: '',
        searchBarSensitivity: true,
    };

    async componentDidMount() {
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
    }

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
     }


    onAccountIconPress = () => {
        NavigationService.navigate('EditAccount');
    };

    onModalOpen = () => {
        NavigationService.setModalVisibility(true);
        NavigationService.navigate('SearchScreen');
    }

    onModalClose = () => {
        Alert.alert("Closed Modal");
        this.setState({modalVisible: false, searchBarSensitivity:true});
    }

    render() {
        return (
            <SafeAreaView style = {globalStyles.droidSafeArea}>
                <View style={styles.topContainer}>

                    <View style={styles.row}>

                        {/* Side bar navigation icon */}
                        <TouchableOpacity onPress = { () => NavigationService.openDrawer()}>

                            <Icon name='menu' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200}
                                style={{marginLeft: 18}} />

                        </TouchableOpacity>

                        {/* User account icon  */}
                        <TouchableOpacity onPress ={this.onAccountIconPress} >
                            <Icon name='user' size={25} color='rgba(175,76,99,1)'
                                style={{marginLeft: (WIDTH - 85)}} />
                        </TouchableOpacity>

                    </View>
                
                </View>

                <Autocomplete
                    editable = {this.state.searchBarSensitivity}
                    containerStyle={styles.searchContainer}  
                    inputContainerStyle={styles.searchInputContainer}
                    placeholder= "    Search recipes, ingredients..."
                    onFocus = {this.onModalOpen}    
                />

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({

    /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },

    /*------------------------------------------------------------------------
       Top Section
    ------------------------------------------------------------------------*/
    topContainer: {
        width: '100%',
        height: 80,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: 'rgba(244, 238, 238, 0.5)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },

    /*------------------------------------------------------------------------
        Newsfeed Section
    ------------------------------------------------------------------------*/
    newsfeedContainer: {
        height: '81.2%',
        backgroundColor: 'rgba(215, 215, 215, 0.2)',
    },


    /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(225, 218, 218, 0.7)'},

     /*------------------------------------------------------------------------
        Autocomplete Section
    ------------------------------------------------------------------------*/
    
    searchContainer: {
        alignSelf: 'center',
        width: '74%',
        marginTop: 10,
        flex: 1,
        top: 17,
        zIndex: 1,
        position: 'absolute',
    },

    searchInputContainer: {
        alignSelf: 'center',
        width: '94%',
        paddingLeft: 10,
        backgroundColor: 'rgba(255,255,255,1)',
        // marginTop: -5,
    },

    searchInput: {
        width: '100%',
        fontSize: 15,
        paddingLeft: 10,
    },

    itemTextContainer: {
        width: '100%',
        marginLeft: 10,
    },

    itemText: {
        width: '100%',
    },
});