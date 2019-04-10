import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Button, Image,  Dimensions, TouchableOpacity, Alert, SafeAreaView, Picker } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import { StackActions } from 'react-navigation';
import ApiUtils from './../api/apiUtils';
// import globalStyles from './../styles/GlobalStyles';
var globalStyles = require('./../styles/GlobalStyles.js');

import * as firebase from 'firebase';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

const { width: WIDTH } = Dimensions.get('window');

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            query: '',
            recipes: [],
            recipeTitle: '',
            recipeId: '',
            selectedCuisine: '',
            selectedDiet: '',
            // intolerances 
            dairy: false,
            egg : false,
            gluten : false,
            peanut : false,
            sesame : false,
            seafood : false,
            shellfish : false,
            soy : false,
            sulfite : false,
            treenut : false,
            wheat : false
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
        'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});
    }

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
    }

    toggleDairy () {
        this.setState({dairy: !this.state.dairy})
    }
    render() {

        const { query } = this.state;
        const recipes = this.findRecipe(query);
        const comp = (a,b) => a.toLowerCase().trim() == b.toLowerCase().trim();

        return (
            <ScrollView styles={globalStyles.droidSafeArea}>
                <View style={styles.topContainer}>

                        <View style={styles.row}>

                            {/* Side bar navigation icon */}
                            <TouchableOpacity onPress = { () => NavigationService.openDrawer()}>
                                <Icon name='menu' size={25} color='rgba(175,76,99,1)' backgroundColor='red' height={200}

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
                    <Text>Cuisine</Text>
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

                    <Text>Diet</Text>
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
                    <Text>Intolerances</Text>
                    <CheckBox
                        title='Dairy'
                        checked={this.state.dairy}
                        onPress={() => this.setState({dairy: !this.state.dairy})}
                    />
                    <CheckBox
                        title='Egg'
                        checked={this.state.egg}
                        onPress={() => this.setState({egg: !this.state.egg})}
                    />
                    <CheckBox
                        title='Gluten'
                        checked={this.state.gluten}
                        onPress={() => this.setState({gluten: !this.state.gluten})}
                    />
                    <CheckBox
                        title='Peanut'
                        checked={this.state.peanut}
                        onPress={() => this.setState({peanut: !this.state.peanut})}
                    />
                    <CheckBox
                        title='Sesame'
                        checked={this.state.sesame}
                        onPress={() => this.setState({sesame: !this.state.sesame})}
                    />
                    <CheckBox
                        title='Seafood'
                        checked={this.state.seafood}
                        onPress={() => this.setState({seafood: !this.state.seafood})}
                    />
                    <CheckBox
                        title='Shellfish'
                        checked={this.state.shellfish}
                        onPress={() => this.setState({shellfish: !this.state.shellfish})}
                    />
                    <CheckBox
                        title='Soy'
                        checked={this.state.soy}
                        onPress={() => this.setState({soy: !this.state.soy})}
                    />
                    <CheckBox
                        title='Sulfite'
                        checked={this.state.sulfite}
                        onPress={() => this.setState({sulfite: !this.state.sulfite})}
                    />
                    <CheckBox
                        title='Treenut'
                        checked={this.state.treenut}
                        onPress={() => this.setState({treenut: !this.state.treenut})}
                    />
                    <CheckBox
                        title='Wheat'
                        checked={this.state.wheat}
                        onPress={() => this.setState({wheat: !this.state.wheat})}
                    />
                    {/* <Picker style={styles.choiceRow}
                                selectedValue={this.state.selectedIntolerances}
                                onValueChange={ (itemValue, itemIndex) => this.setState({selectedIntolerances : itemValue }) }
                                mode = {'dropdown'}>
                            <Picker.Item style={styles.picker} label='None' value='' />
                            <Picker.Item style={styles.picker} label='Dairy' value='dairy' />
                            <Picker.Item style={styles.picker} label='Egg' value='egg' />
                            <Picker.Item style={styles.picker} label='Gluten' value='gluten' />
                            <Picker.Item style={styles.picker} label='Vegan' value='vegan' />
                            <Picker.Item style={styles.picker} label='Vegetarian' value='vegetarian' />
                    </Picker> */}
            </ScrollView>
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