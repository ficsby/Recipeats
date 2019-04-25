import React, { Component } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Dimensions, TouchableOpacity, Alert, Modal, SafeAreaView } from 'react-native';
import { StackActions, DrawerActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import SearchHeaderNav from './../navigation/SearchHeaderNav';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'
import LoadingScreen from './LoadingScreen';
import * as firebase from 'firebase';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../config/icon-font.json';
import NavigationService from '../navigation/NavigationService.js';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

// Fetch News Components
const fetch = require('node-fetch');

import NewsItem from './components/NewsItem';
// import apiUtils from '../api/apiUtils.js';
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            query: '',
            isLoading: true,
            recipes: [],
            article_items: [],
            video_items: [],
            food_trivia: '',
        };
    };

    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="home" style ={{fontSize: 24, color:tintColor}} />
        )
    } 

    async componentDidMount() {
        this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
        await Font.loadAsync({
          'dancing-script': require('../assets/fonts/DancingScript-Regular.otf'),
        }); 
        this.setState({fontLoaded: true});

        const foodTrivia = await apiUtils.getRandomFoodTrivia(this);
        const foodArticles = await apiUtils.getRandomFoodArticles(this);
        const foodVids = await apiUtils.getRandomFoodVideos(this);
        
        if((foodTrivia != null) && (foodVids != null) && (foodArticles != null))
        {
            this.setState({ isLoading: false });
        }
    };

    componentWillUnmount () {
        this._ismounted = false; // after component is unmounted reste boolean
     };

    onAccountIconPress = () => {
        NavigationService.navigate('EditAccountScreen');
        this.setState({visible: true});
    };

    /**
     *  Renders food articles, in which each article_item is mapped as a NewsItem. 
     *  Each NewsItem contains a title, image, and link. 
     */
    renderArticles() {
        return this.state.article_items.map((articles, index) => {
            return <NewsItem key={index} news={articles} index={index} type={2} />
        });
    };

    /**
     *  Renders food videos, in which each video_item is mapped as a NewsItem. 
     *  Each NewsItem contains a title and its corresponding video.
     */
    renderVideos() {
        return this.state.video_items.map((vids, index) => {
            return <NewsItem key={index} news={vids} index={index} type={3} />
        });
    };

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen />;
        };
        
        return (
            <View style={styles.pageContainer}>
                <SearchHeaderNav/>
                <ScrollableTabView  renderTabBar={() => ( <ScrollableTabBar  style={styles.scrollStyle} tabStyle={styles.tabStyle} /> )}
                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarInactiveTextColor={'black'}
                tabBarActiveTextColor={'red'}
                tabBarUnderlineStyle={styles.underlineStyle}
                initialPage={0}
                >

                <View key={'1'} tabLabel={'Popular'} style={styles.tabContentSyle}>
                    <ScrollView>
                        <View style={styles.foodTriviaContainer}>
                            <View style={styles.row}>
                                <Icon name='lightbulb' size={30} color='rgba(0,0,0,1)' height={200} style={{marginLeft: 15}} />
                                <Text style={styles.foodTriviaHeader}> Food Trivia of the Day </Text>
                            </View>
                            <Text style= {styles.foodTrivia}>  {this.state.food_trivia}  </Text>
                        </View>
                        {this.renderArticles()}
                    </ScrollView>
                </View>
                <View key={'2'} tabLabel={'Videos'} style={styles.tabContentSyle}>   
                    <ScrollView>{this.renderVideos()}</ScrollView>
                </View>
                </ScrollableTabView>            
        </View>
        );
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
    pageContainer: {
        flex: 1,
        width: '100%',
    },

    /*------------------------------------------------------------------------
        Tabs Styles
    ------------------------------------------------------------------------*/
    tabStyle: {
    },

    tabContentSyle: {
        flex: 1,
        backgroundColor: 'rgb(247, 247, 247)',
    },

    scrollStyle: {
        backgroundColor: 'white',
    },

    tabBarTextStyle: {
        width: 50,
        fontSize: 14,
        fontWeight: 'normal',
    },

    underlineStyle: { 
        height: 3,
        backgroundColor: 'red',
        borderRadius: 3,
        width: 30,
    },

    /*------------------------------------------------------------------------
        Newsfeed Section
    ------------------------------------------------------------------------*/
    foodTriviaContainer: {
        backgroundColor: 'white',
        paddingRight: 30,
        paddingLeft: 30,
        paddingTop: 20,
        paddingBottom: 30,
        marginTop: hPercentage('2%'),
        marginBottom: hPercentage('2%'),
    },

    foodTriviaHeader: {
        width: '100%',
        fontSize: 25,
        fontWeight: '500',
        marginBottom: hPercentage('2%'),
        marginLeft: wPercentage('2%'),
        marginRight: wPercentage('5%'),

    },

    foodTrivia: {
        fontSize: 15,
    },
});