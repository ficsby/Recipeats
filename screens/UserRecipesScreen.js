import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView
} from "react-native";
import { StackActions, DrawerActions } from "react-navigation";
import Autocomplete from "react-native-autocomplete-input";
import { SearchBar } from "react-native-elements";
import { Font, AppLoading } from "expo";
import SearchHeaderNav from "./../navigation/SearchHeaderNav";
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar
} from "react-native-scrollable-tab-view-forked";
import LoadingScreen from "./LoadingScreen";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import RecipeListItem from "./components/RecipeListItem";
import { Styles } from "../styles/GlobalStyles";

import * as firebase from "firebase";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../config/icon-font.json";
import NavigationService from "../navigation/NavigationService.js";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

const { width: WIDTH } = Dimensions.get("window");
var globalStyles = require("./../styles/GlobalStyles.js");

// Fetch News Components
const fetch = require("node-fetch");

import Button from "./components/Button";
import CreateRecipeModal from "./components/CreateRecipeModal";

// import NewsItem from './components/NewsItem';
// import apiUtils from '../api/apiUtils.js';
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class UserRecipesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      recipeModalVisible: false,
      query: "",
      isLoading: true,
      recipeCreated: false,
      customRecipes: [],
      bookmarkedRecipes: []
    };
    this.toggleRecipeModalVisibility = this.toggleRecipeModalVisibility.bind(
      this
    );
    this.renderCustomRecipes = this.renderCustomRecipes.bind(this);
    this.renderBookmarks = this.renderBookmarks.bind(this);
    this.showCreateRecipeModal = this.showCreateRecipeModal.bind(this);
    this.showRecipeScreen = this.showRecipeScreen.bind(this); // Calls the NavigationService.navigate
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ fontSize: 24, color: tintColor }} />
    )
  };

  async componentDidMount() {
    console.log("test");
    this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
    await Font.loadAsync({
      "dancing-script": require("../assets/fonts/DancingScript-Regular.otf")
    });
    this.setState({ fontLoaded: true });
    this.getCustomRecipesFromFirebase();
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  onAccountIconPress = () => {
    // var navActions = StackActions.reset({
    //     index: 1,
    //     actions: [
    //         // We need to push both the current screen and the next screen that we are transitioning to incase the user wants to go to previous screen
    //         StackActions.push({ routeName: "Home" }),
    //         StackActions.push({ routeName: "EditAccount" }),
    //     ]
    // });

    // this.props.navigation.dispatch(navActions);
    this.setState({ visible: true });
  };

  getCustomRecipesFromFirebase() {
    console.log("custom recipes");
    // Returns a promise of the user's value
    retrieveData = () => {
      userId = firebase.auth().currentUser.uid;
      ref = firebase.database().ref("customRecipes/" + userId + "/");
      return ref.once("value");
    };
    context = this;
    retrieveData().then(snapshot => {
      customRecipeSnapshot = snapshot.val();
      recipes = [];
      if (
        context.state.customRecipes.length !=
        Object.keys(customRecipeSnapshot).length
      ) {
        for (var key in customRecipeSnapshot) {
          if (customRecipeSnapshot.hasOwnProperty(key)) {
            recipes.push(customRecipeSnapshot[key]);
          }
        }

        context.setState({
          customRecipes: recipes
        });
      }
    });
  }

  getBookmarkedRecipesFromFirebase() {
    retrieveData = () => {
      userId = firebase.auth().currentUser.uid;
      ref = firebase.database().ref("bookmarkedRecipes/" + userId + "/");
      return ref.once("value");
    };
    // bookmarkedRecipes
    context = this;
    retrieveData().then(snapshot => {
      bookmarkedRecipeSnapshot = snapshot.val();
      recipes = [];
      if (
        context.state.bookmarkedRecipes.length !=
        Object.keys(bookmarkedRecipeSnapshot).length
      ) {
        for (var key in bookmarkedRecipeSnapshot) {
          if (bookmarkedRecipeSnapshot.hasOwnProperty(key)) {
            recipes.push(bookmarkedRecipeSnapshot[key]);
          }
        }

        context.setState({
          bookmarkedRecipes: recipes
        });
      }
    });
  }
  /**
   *  Renders the user's custom recipes, in which each item in customRecipes is mapped as a RecipeListItem.
   *  Each RecipeListItem displays the title, image, serving size, cook time
   */
  renderCustomRecipes() {
    if (this.state.customRecipes.length > 0) {
      return this.state.customRecipes.map((recipe, index) => {
        return (
          <RecipeListItem
            parent={this}
            item={recipe}
            rowId={index}
            sectionId={1}
            bookmarked={false}
          />
        ); //sectionId 1 refers to custom recipes
      });
    }
    return <Text style={styles.emptyList}>No custom recipes to show.</Text>;
  }

  /**
   *  Renders bookmarks, in which each item in bookmarkedRecipes is mapped as a RecipeListItem.
   *  Each RecipeListItem displays the title, image, serving size, cook time
   */
  renderBookmarks() {
    if (this.state.bookmarkedRecipes.length > 0) {
      return this.state.bookmarkedRecipes.map((recipe, index) => {
        return (
          <RecipeListItem
            parent={this}
            item={recipe}
            rowId={index}
            sectionId={2}
            bookmarked={true}
          />
        ); //sectionId 2 refers to bookmarked recipes
      });
    }
    return (
      <Text style={{ marginTop: hPercentage("17%"), textAlign: "center" }}>
        No bookmarks to show.
      </Text>
    );
  }

  showCreateRecipeModal() {
    return (
      <CreateRecipeModal
        isModalVisible={this.state.recipeModalVisible}
        parent={this}
      />
    );
  }

  toggleRecipeModalVisibility() {
    this.setState({ recipeModalVisible: !this.state.recipeModalVisible });
  }

  showRecipeScreen(newRecipe) {
    NavigationService.navigate("RecipeScreen", {
      editable: true,
      recipeId: newRecipe.id,
      title: newRecipe.title,
      servings: newRecipe.servings,
      readyInMinutes: newRecipe.readyInMinutes,
      calories: newRecipe.calories,
      protein: newRecipe.protein,
      carbs: newRecipe.carbs,
      fats: newRecipe.fats,
      extendedIngredients: [],
      instructions: []
    });
    this.setState({ recipeCreated: false });
  }

  render() {
    // if (this.state.isLoading) {
    //     return <LoadingScreen />;
    // };
    this.getCustomRecipesFromFirebase();
    this.getBookmarkedRecipesFromFirebase();
    if (this.state.recipeCreated) {
      this.showRecipeScreen(
        this.state.customRecipes[[this.state.customRecipes.length - 1]]
      );
    }
    return (
      <View style={styles.pageContainer}>
        {/* <SearchHeaderNav /> */}

        {this.showCreateRecipeModal()}

        <Text style={Styles.sectionTitle}> Your Recipes </Text>

        <ScrollableTabView
          renderTabBar={() => (
            <ScrollableTabBar
              style={styles.scrollStyle}
              tabStyle={styles.tabStyle}
            />
          )}
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarInactiveTextColor={"black"}
          tabBarActiveTextColor={"rgba(214, 104, 92, 1)"}
          tabBarUnderlineStyle={styles.underlineStyle}
          initialPage={0}
        >
          <View
            key={"1"}
            tabLabel={"Custom Recipes"}
            style={styles.tabContentSyle}
          >
            <ListItem
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              containerStyle={{
                backgroundColor: "rgba(50, 181, 175, 1)",
                marginTop: hPercentage("2%"),
                paddingTop: hPercentage("1%"),
                paddingBottom: hPercentage("1%"),
                paddingLeft: wPercentage("8%"),
                paddingRight: wPercentage("8%"),
                borderTopColor: "rgba(0,0,0,0.1)",
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderTopWidth: 1,
                borderBottomWidth: 1
              }}
              title="Create New Recipe"
              rightIcon={
                <Icon name="plus" size={18} color="rgba(255,255,255,1)" />
              }
              titleStyle={{
                color: "rgba(255,255,255,1)",
                fontWeight: "500",
                fontSize: 17,
                paddingRight: wPercentage("2%"),
                textAlign: "center"
              }}
              onPress={() => this.toggleRecipeModalVisibility()}
            />
            <ScrollView>
              <View style={styles.customRecipesContainer}>
                {this.renderCustomRecipes()}
              </View>
            </ScrollView>
          </View>
          <View key={"2"} tabLabel={"Bookmarks"} style={styles.tabContentSyle}>
            <ScrollView>
              <View style={styles.bookmarksContainer}>
                {this.renderBookmarks()}
              </View>
            </ScrollView>
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
    flexDirection: "row",
    width: "100%"
  },

  createRecipeButton: {
    flex: 2,
    alignSelf: "flex-end",
    position: "absolute",
    borderRadius: 120,
    borderColor: "rgb(178, 60, 60)",
    borderWidth: 2,
    right: 25,
    bottom: 25
  },

  /*------------------------------------------------------------------------
       Top Section
    ------------------------------------------------------------------------*/
  pageContainer: {
    flex: 1,
    width: "100%"
  },

  topContainer: {
    width: "100%",
    height: 80,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "rgba(244, 238, 238, 0.9)",
    borderBottomColor: "rgba(225, 218, 218, 0.7)",
    borderBottomWidth: 2.1
  },

  /*------------------------------------------------------------------------
        Autocomplete Section
    ------------------------------------------------------------------------*/
  searchContainer: {
    alignSelf: "center",
    width: "74%",
    marginTop: 10,
    flex: 1,
    top: 17,
    zIndex: 1,
    position: "absolute"
  },

  searchInputContainer: {
    alignSelf: "center",
    width: "94%",
    paddingLeft: 10,
    backgroundColor: "rgba(255,255,255,1)"
    // marginTop: -5,
  },

  searchInput: {
    width: "100%",
    fontSize: 15,
    paddingLeft: 10
  },

  searchResultsContainer: {
    width: "100%",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  },

  searchResult: {
    width: "100%"
  },

  /*------------------------------------------------------------------------
        Sidebar Navigation Section
    ------------------------------------------------------------------------*/

  /*
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
    */

  /*------------------------------------------------------------------------
        Tabs Styles
    ------------------------------------------------------------------------*/
  tabStyle: {},

  tabContentSyle: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 247)"
  },

  scrollStyle: {
    backgroundColor: "white"
    // justifyContent: 'center',
  },

  tabBarTextStyle: {
    width: wPercentage("35%"),
    paddingLeft: wPercentage("7%"),
    fontSize: 14,
    fontWeight: "normal"
  },

  underlineStyle: {
    height: 3,
    backgroundColor: "red",
    borderRadius: 3,
    width: 30
  },

  customRecipesContainer: {
    // backgroundColor: 'white',
    // paddingRight: 30,
    // paddingLeft: 30,
    // paddingTop: 20,
    // paddingBottom: 30,
    // marginTop: 13,
    // marginBottom: 13,
  },

  bookmarksContainer: {
    // backgroundColor: 'white',
    // paddingRight: 30,
    // paddingLeft: 30,
    // paddingTop: 20,
    // paddingBottom: 30,
    // marginTop: 13,
    // marginBottom: 13,
  },

  get bookmarksContainer() {
    return this._bookmarksContainer;
  },
  set bookmarksContainer(value) {
    this._bookmarksContainer = value;
  },

  bookmarksHeader: {
    width: "100%",
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 40
  },

  bookmarks: {
    fontSize: 15
  },

  // header: {
  //     flexDirection: 'row',
  //     backgroundColor: '#FFF',
  //     padding: 5,
  //     fontSize: 25,
  //     borderBottomColor: '#E1E1E1',
  //     borderBottomWidth: 1
  // },

  // headerButton: {
  //     flex: 1,
  // },

  // headerText: {
  //     flex: 1,
  // },

  // headerTextLabel: {
  //     width: '100%',
  //     fontSize: 20,
  //     textAlign: 'center'
  // },

  newsContainer: {
    backgroundColor: "rgba(226, 226, 226, 0.5)",
    alignContent: "center",
    width: "100%"
  },

  whitespace: {
    flex: 1
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  // back_button_label: {
  //     color: '#397CA9',
  //     fontSize: 20,
  // },

  emptyList: {
    marginTop: hPercentage("10%"),
    textAlign: "center"
  },

  /*------------------------------------------------------------------------
        Bottom Menu Section
    ------------------------------------------------------------------------*/
  menuBar: {
    width: "20%",
    height: 100,
    backgroundColor: "rgba(225, 218, 218, 0.7)"
  }
});
