import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Button, Image,  Dimensions, TouchableOpacity, Alert, SafeAreaView, Picker, BackHandler  } from 'react-native';
import Modal from 'react-native-modal';
import Autocomplete from 'react-native-autocomplete-input';
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import ApiUtils from './../api/apiUtils';
// import globalStyles from './../styles/GlobalStyles';
var globalStyles = require('./../styles/GlobalStyles.js');

import * as firebase from 'firebase';
import NavigationService from '../navigation/NavigationService.js';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get('window').height;
const { width: WIDTH } = Dimensions.get('window');

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkBoxModalVisible: false,
            visible: false,
            query: '',
            recipes: [],
            recipeTitle: '',
            recipeId: '',
            selectedCuisine: '',
            selectedDiet: '',
            // intolerances 
            intolerances: {
                'dairy': false,
                'egg' : false,
                'gluten' : false,
                'peanut' : false,
                'sesame' : false,
                'seafood' : false,
                'shellfish' : false,
                'soy' : false,
                'sulfite' : false,
                'treenut' : false,
                'wheat' : false
            }

        };
    }

    /* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
    */
    async getAutoCompleteRecipesByName(text){
        this.setState({query: text});
        await ApiUtils.getAutoCompleteRecipesByName(text, this);
    }

    findRecipe = (query) => {
        if( query === '') { return []; }
        const { recipes } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return recipes.filter(recipe => recipe.title.search(regex) >= 0);
    }

    async componentDidMount() {
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
        'dancing-script': require('./../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    toggleIntolerance(type){
        temp = this.state.intolerances;

        for(key in temp){
            if(key == type){
                temp[key] = !temp[key];
                break;
            }
        }

        this.setState({intolerances: temp});
    }

    toggleVisibility(){
        NavigationService.setModalVisibility(false);
    }
    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();

        return (
            <ScrollView styles={styles.searchScreenContainer}>
                <View style={styles.topContainer}>

                        <View style={styles.row}>

                            {/* Side bar navigation icon */}
                            <TouchableOpacity onPress = { () => this.props.navigation.goBack(null)}>
                                <Icon name='back' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200}

                                    style={{marginLeft: 18}} />
                            </TouchableOpacity>

                            {/* User account icon  */}
                            <TouchableOpacity onPress ={this.onAccountIconPress} >
                                <Icon name='filter' size={25} color='rgba(175,76,99,1)'
                                    style={{marginLeft: (WIDTH - 85)}} />
                            </TouchableOpacity>

                        </View>
                    
                </View>
                
                    <Autocomplete
                        autoFocus={true}
                        containerStyle={styles.searchContainer}  
                        inputContainerStyle={styles.searchInputContainer}
                        data={recipes.length === 1 && comp(query, recipes[0].title) ? [] : recipes}
                        defaultValue = { query }
                        autoCorrect={false}
                        placeholder= "    Search recipes, ingredients..."
                        onChangeText={text => this.getAutoCompleteRecipesByName(text)}
                        onFocus = {this.onModalVisibleChange}
                        renderItem={({ id, title }) => (
                            <TouchableOpacity style={styles.itemTextContainer} onPress={() => this.setState({ query: title })}>
                                <Text style={styles.itemText}>
                                    {title}
                                </Text>
                            </TouchableOpacity>
                        )}                       
                    />

                    {/* const cuisines = [
                        'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian',
                        'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun',
                        'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american'
                    ] */}
                    <Text style={styles.filters}>Filter by Cuisine</Text>
                    <Picker style={styles.choiceRow}
                                selectedValue={this.state.selectedCuisine}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedCuisine : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label='None' value='' />
                            <Picker.Item style={styles.picker} label='African' value='african' />
                            <Picker.Item style={styles.picker} label='Chinese' value='chinese' />
                            <Picker.Item style={styles.picker} label='Japanese' value='japanese' />
                            <Picker.Item style={styles.picker} label='Vietnamese' value='vietnamese' />
                            <Picker.Item style={styles.picker} label='Thai' value='thai' />
                            <Picker.Item style={styles.picker} label='British' value='british' />
                            <Picker.Item style={styles.picker} label='Irish' value='irish' />
                            <Picker.Item style={styles.picker} label='French' value='french' />
                            <Picker.Item style={styles.picker} label='Italian' value='italian' />
                            <Picker.Item style={styles.picker} label='Mexican' value='mexican' />
                            <Picker.Item style={styles.picker} label='Spanish' value='spanish' />
                            <Picker.Item style={styles.picker} label='Middle Eastern' value='middle eastern' />
                            <Picker.Item style={styles.picker} label='Jewish' value='jewish' />
                            <Picker.Item style={styles.picker} label='American' value='american' />
                            <Picker.Item style={styles.picker} label='Cajun' value='cajun' />
                            <Picker.Item style={styles.picker} label='Southern' value='southern' />
                            <Picker.Item style={styles.picker} label='Greek' value='greek' />
                            <Picker.Item style={styles.picker} label='German' value='german' />
                            <Picker.Item style={styles.picker} label='Nordic' value='nordic' />
                            <Picker.Item style={styles.picker} label='Eastern European' value='eastern european' />
                            <Picker.Item style={styles.picker} label='Caribbean' value='caribbean' />
                            <Picker.Item style={styles.picker} label='Latin American' value='latin american' />
                    </Picker>

                    
                    {/* // const diet = [
                    //     'pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'vegetarian'
                    // ] */}

                    <Text style={styles.filters}>Filter by Diet</Text>
                    <Picker style={styles.choiceRow}
                                selectedValue={this.state.selectedDiet}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedDiet : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label='None' value='' />
                            <Picker.Item style={styles.picker} label='Pescetarian' value='pescetarian' />
                            <Picker.Item style={styles.picker} label='Lacto Vegetarian' value='lacto vegetarian' />
                            <Picker.Item style={styles.picker} label='Ovo Vegetarian' value='ovo vegetarian' />
                            <Picker.Item style={styles.picker} label='Vegan' value='vegan' />
                            <Picker.Item style={styles.picker} label='Vegetarian' value='vegetarian' />
                    </Picker>

                    {/* // const intolerances = [
                    //     'dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat'
                    // ] */}
                    {/* <TouchableOpacity onPress ={() => this.setState({checkBoxModalVisible:true})}> */}
                    <Text style={styles.filters}>Filter by Food Intolerances</Text>
                    {/* </TouchableOpacity> */}

                    {/* <View style={styles.checkBoxModalContainer}> */}
                        {/* <Modal
                            style={styles.checkBoxModal} 
                            isVisible={this.state.checkBoxModalVisible}
                            deviceWidth={deviceWidth}
                            deviceHeight={deviceHeight} 
                            onBackButtonPress={() => this.setState({checkBoxModalVisible:false})}
                            > */}
                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <CheckBox
                                        title='Dairy'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['dairy']}
                                        onPress={() => this.toggleIntolerance('dairy')}
                                    />
                                    <CheckBox
                                        title='Egg'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['egg']}
                                        onPress={() => this.toggleIntolerance('egg')}
                                    />
                                    <CheckBox
                                        title='Gluten'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['gluten']}
                                        onPress={() => this.toggleIntolerance('gluten')}
                                    />
                                    <CheckBox
                                        title='Peanut'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['peanut']}
                                        onPress={() => this.toggleIntolerance('peanut')}
                                    />
                                </View>

                                <View style={styles.col}>
                                    <CheckBox
                                        title='Sesame'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['sesame']}
                                        onPress={() => this.toggleIntolerance('sesame')}
                                    />
                                    <CheckBox
                                        title='Seafood'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['seafood']}
                                        onPress={() => this.toggleIntolerance('seafood')}
                                    />
                                    <CheckBox
                                        title='Shellfish'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['shellfish']}
                                        onPress={() => this.toggleIntolerance('shellfish')}
                                    />
                                    <CheckBox
                                        title='Soy'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['soy']}
                                        onPress={() => this.toggleIntolerance('soy')}
                                    />
                                </View>

                                <View style={styles.col}>
                                    <CheckBox
                                        title='Sulfite'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['sulfite']}
                                        onPress={() => this.toggleIntolerance('sulfite')}
                                    />
                                    <CheckBox
                                        title='Treenut'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['treenut']}
                                        onPress={() => this.toggleIntolerance('treenut')}
                                    />
                                    <CheckBox
                                        title='Wheat'
                                        style={styles.intoleranceBox}
                                        checked={this.state.intolerances['wheat']}
                                        onPress={() => this.toggleIntolerance('wheat')}
                                    />
                                </View>
                            </View>
                        {/* </Modal> */}
                    {/* </View> */}
                    
                    
                    {/* <Text>Food you want to exclude</Text> */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    /*------------------------------------------------------------------------
        General Styles
    ------------------------------------------------------------------------*/
    searchScreenContainer: {
        fontFamily:'dancing-script'
    },  

    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },

    col: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },

    filters: {
        fontSize: 25,
        color: 'rgba(175,76,99,1)',
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

    intoleranceBox: {
        width: wPercentage('30%'),
    },

    droidSafeArea: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    checkBoxModalContainer: {
        backgroundColor: 'white',
        width: wPercentage('90%'),
        height: hPercentage('50%'),
    },

    checkBoxModal:{
        position: 'absolute',
        top: '25%',
        width: wPercentage('90%'),
        height: hPercentage('40%'),
    }
});