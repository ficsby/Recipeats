import React from 'react';
import { StyleSheet, Button, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
//import * as firebase from 'firebase';

//import logo from './../../assets/images/logo_transparent.png';
//import { reset } from 'expo/build/AR';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');
var globalStyles = require('../styles/globalStyles.js');

export default class HomeScreen extends React.Component {
    
    state = {
        search: '',
    };
    
    updateSearch = search => {
        this.setState({ search });
    };
    
    async componentDidMount() {
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
    };

    onAccountIconPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [
                StackActions.push({ routeName: "EditAccount" })
            ]
        });

        this.props.navigation.dispatch(navActions);
    }

    render() {

        const { search } = this.state;

        return (
            <View style={{flex: 1}}> 

                <View style={styles.topContainer}>

                    <View style={styles.row}>
                        {/* Side bar navigation icon */}
                        <TouchableOpacity style={{height: 80}}>
                            <Icon name='menu' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '20%'}} />
                        </TouchableOpacity>

                        {/* User account icon */}
                        <TouchableOpacity style={{height: 80}} onPress ={this.onAccountIconPress}>
                            <Icon name='user' size={30} color='rgba(175,76,99,1)'
                                style={{marginLeft: '75%'}} />
                        </TouchableOpacity>
                    </View>

                    <SearchBar placeholder="Search recipes, ingredients..."
                               lightTheme={true}
                               round={true}
                               containerStyle={styles.searchContainer}
                               inputContainerStyle={styles.searchInputContainer}
                               inputStyle={styles.searchInput}
                               onChangeText={this.updateSearch}
                               value={search} />
                </View>
                
                <ScrollView style={styles.recipeContainer}> 

                    <Image styles={styles.image} resizeMode="cover" source={require('./../assets/images/test_photo.jpg')} />

                    <View style={styles.recipeInfo}>
                        <Text style={styles.recipeTitle}> Some Recipe Title </Text>

                        <View style={styles.row}>
                            <Icon style={styles.recipeStatsIcon} name='clock' size={13} color='rgba(0,0,0, 0.5)' />
                            <Text style={styles.recipeStats}> 60 mins </Text>
                            <Icon style={styles.recipeStatsIcon} name='adult' size={13} color='rgba(0,0,0, 0.5)' />
                            <Text style={styles.recipeStats}> 2 servings </Text>
                        </View>
                      


                    </View>


                </ScrollView>

                <View style={styles.row}> 
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name='home' size={33} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '16%', paddingLeft: '28%'}} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name='recipe-book' size={32} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '18%', paddingLeft: '28%'}} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="budget" size={37} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '15%', paddingLeft: '28%'}} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="food-stock" size={30} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '18%', paddingLeft: '24%'}} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuBar}>
                        <Icon name="food-diary" size={35} color='rgba(175,76,99,1)'
                                    style={{paddingTop: '15%', paddingLeft: '29%'}} />
                    </TouchableOpacity>
                </View>
                            
            </View>
        )
        //return <Text style={{paddingTop:20}}>LoginScreen</Text>
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

    recipeRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center', // Used to set Text Component Vertically Center
        alignItems: 'center', // Used to set Text Component Horizontally Center
    },

    /*------------------------------------------------------------------------
       Top Section
    ------------------------------------------------------------------------*/
    topContainer: {
        height: '15%',
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 238, 238, 0.5)',
        borderBottomColor: 'rgba(225, 218, 218, 0.7)',
        borderBottomWidth: 2.1,
      },

    searchContainer: {
        height: 45,
        width: '90%',
        backgroundColor: 'white',
    },

    searchInputContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: -5,
    },

    searchInput: {
        fontSize: 15,
    },

    /*------------------------------------------------------------------------
       Recipe Info Section
    ------------------------------------------------------------------------*/

    recipeContainer: {
        backgroundColor: 'rgba(240, 240, 240, 0.2)',
    },

    recipeInfo: {
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 13,
        marginRight: 13,
    },

    image: {
        flex: 1,
        width: '100%',
        height: '20%',
    },

    recipeTitle: {
        fontSize: 30,
        fontWeight: '500',
        color: 'rgba(181, 83, 102, 1)', // Medium Pink
    },

    recipeStats: {
        fontSize: 16,
        color: 'rgba(0,0,0, 0.5)',
        marginLeft: 5,
    },

    
    recipeStatsIcon: {
        fontSize: 15,
        color: 'rgba(0,0,0, 0.5)',
        marginTop: 3,
        marginLeft: 14,
    },
    
    /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
    menuBar: {
        width: '20%',
        height: 100, 
        backgroundColor: 'rgba(225, 218, 218, 0.7)'
    },
    
});