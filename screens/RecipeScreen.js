import React from "react";
import {
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  View,
  ScrollView,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";
import { StackActions } from "react-navigation";
import Autocomplete from "react-native-autocomplete-input";
import { ListItem, Badge, Divider } from "react-native-elements";
// import DialogInput from 'react-native-dialog-input';
import FlatListItem from "./components/FlatListItem";
import AddFoodItemModal from "./components/AddFoodItemModal";
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

import { Font, AppLoading } from "expo";
import * as firebase from "firebase";
import NavigationService from "../navigation/NavigationService.js";
import ComparisonModal from "./components/ComparisonModal";
import {
  findMissingFoodItems,
  findSimilarFoodItems,
  modifyFoodStock,
  getFoodList
} from "../utils/FoodListUtils";

/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../config/icon-font.json";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

const fetch = require("node-fetch");

import LoadingScreen from "./LoadingScreen";
import DialogInput from "react-native-dialog-input";
import apiUtils from "../api/apiUtils.js";
import RecipeEditingScreen from "./RecipeEditingScreen";
import SearchHeaderNav from "./../navigation/SearchHeaderNav";
import { heightPercentageToDP } from "react-native-responsive-screen";

const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";

export default class RecipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      editable: NavigationService.getTopLevelNavigator().state.params.editable,
      query: "",
      recipes: [],
      bookmarked: NavigationService.getTopLevelNavigator().state.params
        .bookmarked,
      liked: false,
      comparisonModalVisible: false,

      id: NavigationService.getTopLevelNavigator().state.params.recipeId,
      title: NavigationService.getTopLevelNavigator().state.params.title,
      servings: NavigationService.getTopLevelNavigator().state.params.servings,
      readyInMinutes: NavigationService.getTopLevelNavigator().state.params
        .readyInMinutes,
      extendedIngredients: NavigationService.getTopLevelNavigator().state.params
        .extendedIngredients,
      instructions: NavigationService.getTopLevelNavigator().state.params
        .instructions,
      nutrition: null,

      calories: (NavigationService.getTopLevelNavigator().state.params.calories)? NavigationService.getTopLevelNavigator().state.params.calories : '---',
      protein: (NavigationService.getTopLevelNavigator().state.params.protein? NavigationService.getTopLevelNavigator().state.params.protein : '---'),
      carbs: (NavigationService.getTopLevelNavigator().state.params.carbs)? NavigationService.getTopLevelNavigator().state.params.carbs : '---',
      fats: (NavigationService.getTopLevelNavigator().state.params.fats)? NavigationService.getTopLevelNavigator().state.params.fats : '---',

      sourceUrl: "",
      creditText: "",
      sourceName: "",
      image: NavigationService.getTopLevelNavigator().state.params.image,

      isIngredientModalVisible: false,
      isInstructionModalVisible: false,
      userFoodStock: [],
      convertedAmounts: [],

      deletedRowKey: null,

      nutritionalTags: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        veryHealthy: false,
        cheap: false,
        veryPopular: false,
        sustainable: false,
        weightWatcherSmartPoints: false,
        lowFodmap: false,
        keotgenic: false,
        whole30: false
      }
    };
    this.toggleComparisonModal = this.toggleComparisonModal.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.onPressAddIngredient = this.onPressAddIngredient.bind(this);
    this.onPressAddInstruction = this.onPressAddInstruction.bind(this);
    this.renderIngredientsList = this.renderIngredientsList.bind(this);
    this.renderInstructionsList = this.renderInstructionsList.bind(this);
    this.toggleBookmark = this.toggleBookmark.bind(this);
    this.toggleHeart = this.toggleHeart.bind(this);
    this.renderDefaultBackgroundImage = this.renderDefaultBackgroundImage.bind(
      this
    );
    this.renderChosenBackgroundImage = this.renderChosenBackgroundImage.bind(
      this
    );
  }

  async componentDidMount() {
    this._ismounted = true;
    this.setState({
      fontLoaded: true,
      readyInMinutes: this.state.readyInMinutes
        ? this.state.readyInMinutes.toString()
        : "",
      servings: this.state.servings ? this.state.servings : ""
    });

    if (this.state.id < 0) {
      this.setState({ isLoading: false });
    } else {
      var recipeData = await apiUtils.getRecipeInfoFromId(this.state.id, this);
      var instructionData = await apiUtils.getAnalyzedInstructions(
        this.state.id,
        this
      );
      this.getFoodStock();

      // findSimilarFoodItems();
      if (recipeData != null && instructionData != null) {
        console.log("foodstock");
        console.log(this.state.userFoodStock);
        this.setState({ isLoading: false });
      }
    }
  }

  componentWillUnmount() {
    this._ismounted = false; // after component is unmounted reste boolean
  }

  toggleBookmark() {
    this.setState({ bookmarked: !this.state.bookmarked });
    if (!this.state.bookmarked) {
      firebase
        .database()
        .ref(
          "bookmarkedRecipes/" +
            firebase.auth().currentUser.uid +
            "/" +
            this.state.title +
            "_" +
            this.state.id
        )
        .update({
          id: this.state.id ? this.state.id : "",
          title: this.state.title ? this.state.title : "",
          servings: this.state.servings ? this.state.servings : "",
          readyInMinutes: this.state.readyInMinutes
            ? this.state.readyInMinutes
            : "",

          calories: 155,
          protein: 3,
          carbs: 8,
          fats: 16,

          nutrients: this.state.nutrients ? this.state.nutrients : [],
          sourceUrl: this.state.sourceUrl ? this.state.sourceUrl : "",
          creditText: this.state.creditText ? this.state.creditText : "",
          sourceName: this.state.sourceName ? this.state.sourceName : "",
          image: this.state.image ? this.state.image : "",

          extendedIngredients: this.state.extendedIngredients
            ? this.state.extendedIngredients
            : [],
          instructions: this.state.instructions ? this.state.instructions : []
        });
      Alert.alert("You have bookmarked this recipe.");
    } else {
      Alert.alert(
        "Warning",
        "Are you sure you want to remove " +
          this.state.title +
          " from your Bookmarks?",
        [
          {
            text: "Cancel",
            onPress: () =>
              this.setState({ bookmarked: !this.state.bookmarked }),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => {
              firebase
                .database()
                .ref(
                  "bookmarkedRecipes/" +
                    firebase.auth().currentUser.uid +
                    "/" +
                    this.state.title +
                    "_" +
                    this.state.id
                )
                .remove();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  toggleComparisonModal() {
    this.setState({
      comparisonModalVisible: !this.state.comparisonModalVisible
    });
  }

  // Toggles the like state when the "Heart" icon is tapped
  toggleHeart() {
    this.setState({ liked: !this.state.liked });
  }

  toggleEditable() {
    this.setState({
      editable: !this.state.editable
    });
  }

  toggleIngrModalVisibility() {
    this.setState({
      ingredientModalVisible: !this.state.ingredientModalVisible
    });
  }

  getFoodStock() {
    foodList = [];

    // Returns a promise of the user's value
    retrieveData = () => {
      ref = getFoodList(firebase.auth().currentUser.uid);
      return ref.once("value");
    };

    // Snapshot is the depiction of the user's current data
    retrieveData().then(snapshot => {
      foodListSnapshot = snapshot.val();

      for (var key in foodListSnapshot) {
        if (foodListSnapshot.hasOwnProperty(key)) {
          foodList.push(foodListSnapshot[key]);
        }
      }
      this.setState({ userFoodStock: foodList });
    });
  }

  // Renders the icon according to its current state
  renderIcon(iconType) {
    if (iconType == "bookmark") {
      bookmarkStatus = this.state.bookmarked ? "bookmark" : "bookmark-empty";
      return (
        <Icon
          name={bookmarkStatus}
          size={28}
          color="rgba(255,255,255,1)"
          style={styles.overlayButtons}
        />
      );
    }

    if (iconType == "heart") {
      heartStatus = this.state.liked ? "heart" : "heart-empty";
      return (
        <Icon
          name={heartStatus}
          size={28}
          color="rgba(255,255,255,1)"
          style={styles.overlayButtons}
        />
      );
    }
  }

  onPressAddIngredient() {
    this.setState({ ingredientModalVisible: true });
  }

  onPressAddInstruction() {
    this.setState({ instructionModalVisible: true });
  }

  onAccountIconPress = () => {
    var navActions = StackActions.reset({
      index: 1,
      actions: [
        // We need to push both the current screen and the next screen that we are transitioning to incase the user wants to go to previous screen
        StackActions.push({ routeName: "Home" }),
        StackActions.push({ routeName: "EditAccount" })
      ]
    });

    this.props.navigation.dispatch(navActions);
  };

  renderIngredientsList() {
    return this.state.extendedIngredients.map((item, index) => (
      <View>
        <ListItem
          key={index}
          title={item.name}
          rightTitle={item.amount + " " + item.unit}
          titleStyle={styles.ingredientText}
          rightTitleStyle={styles.amountText}
        />
        <Divider />
      </View>
    ));
  }

  renderInstructionsList() {
    return this.state.editable ? (
      <FlatList
        data={this.state.instructions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <FlatListItem
            parentFlatList={this}
            flatListData={this.state.instructions}
            sectionId={2}
            rowId={index}
            title={item.instruction}
            leftIcon={
              <Badge
                value={index + 1}
                containerStyle={styles.numberContainer}
                badgeStyle={styles.numberBadge}
                textStyle={styles.instructionNumber}
              />
            }
          />
        )}
      />
    ) : (
      this.state.instructions.map((item, index) => (
        <View>
          <ListItem
            key={index}
            title={item.step}
            leftIcon={
              <Badge
                value={index + 1}
                containerStyle={styles.numberContainer}
                badgeStyle={styles.numberBadge}
                textStyle={styles.instructionNumber}
              />
            }
          />
          <Divider />
        </View>
      ))
    );
  }

  renderDefaultBackgroundImage() {
    return (
      <ImageBackground
        source={require("./../assets/images/default_image_0.png")}
        style={styles.image}
      >
        <View style={styles.overlayButtonsContainer}>
          <TouchableOpacity onPress={this.toggleHeart}>
            {this.renderIcon("heart")}
          </TouchableOpacity>

          <TouchableOpacity onPress={this.toggleBookmark}>
            {this.renderIcon("bookmark")}
          </TouchableOpacity>

          <TouchableOpacity onPress={this.downloadRecipe}>
            <Icon
              name="download"
              size={27}
              color="rgba(255,255,255,1)"
              style={styles.overlayButtons}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  renderChosenBackgroundImage() {
    return (
      <ImageBackground source={{ uri: this.state.image }} style={styles.image}>
        <View style={styles.overlayButtonsContainer}>
          <TouchableOpacity onPress={this.toggleHeart}>
            {this.renderIcon("heart")}
          </TouchableOpacity>

          <TouchableOpacity onPress={this.toggleBookmark}>
            {this.renderIcon("bookmark")}
          </TouchableOpacity>

          <TouchableOpacity onPress={this.downloadRecipe}>
            <Icon
              name="download"
              size={27}
              color="rgba(255,255,255,1)"
              style={styles.overlayButtons}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />;
    }

    if (this.state.editable) {
      return <RecipeEditingScreen parent={this} />;
    }

    return (
      <View style={{ flex: 1 }}>
        {/* <SearchHeaderNav /> */}
        {/*---------------------------------------------------------------------------------
                   Recipe Page Contents 
                ------------------------------------------------------------------------------------*/}

        <ScrollView style={styles.recipeContainer}>
          {/* Comparison Modal */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.comparisonModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <ComparisonModal
              parent={this}
              foodstock={this.state.userFoodStock}
              recipeIngredients={this.state.extendedIngredients}
            />
          </Modal>

          {// Gets the recipe cover photo. If null, uses default photo.
          this.state.image
            ? this.renderChosenBackgroundImage()
            : this.renderDefaultBackgroundImage()}

          <View style={styles.contents}>
            <View style={{paddingTop: hPercentage('5%')}} />
            <View style={styles.recipeTitleContainer}>
              <View style={styles.row}>
                <TextInput
                  multiline
                  style={styles.recipeTitle}
                  value={this.state.title}
                  onChangeText={title => this.setState({ title })}
                  editable={this.state.editable}
                />

                <TouchableOpacity>
                  <Text style={styles.editButton} onPress={this.toggleEditable}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsContainer}>
                <Icon
                  style={styles.statsIcon}
                  name="clock"
                  size={13}
                  color="rgba(0,0,0, 0.5)"
                />
                <TextInput
                  style={styles.stats}
                  value={this.state.readyInMinutes.toString()}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: wPercentage("0.35%"),
                    marginLeft: wPercentage("1.6%"),
                    marginRight: wPercentage("2.2%")
                  }}
                >
                  minutes
                </Text>

                <Icon
                  style={styles.statsIcon}
                  name="adult"
                  size={13}
                  color="rgba(0,0,0, 0.5)"
                />
                <TextInput
                  style={styles.stats}
                  value={this.state.servings.toString()}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: hPercentage("0.35%"),
                    marginLeft: wPercentage("1.6%"),
                    marginRight: wPercentage("2%")
                  }}
                >
                  servings
                </Text>
              </View>
            </View>

            <View style={styles.macrosContainer}>
              <View style={styles.macrosColumn}>
                <TextInput
                  style={styles.macrosData}
                  value={this.state.calories + ""}
                />
                <Text style={styles.macrosLabel}> CALORIES </Text>
              </View>
              <View style={styles.macrosColumn}>
                <TextInput
                  style={styles.macrosData}
                  value={this.state.protein + ""}
                />
                <Text style={styles.macrosLabel}> PROTEIN </Text>
              </View>
              <View style={styles.macrosColumn}>
                <TextInput
                  style={styles.macrosData}
                  value={this.state.carbs + ""}
                />
                <Text style={styles.macrosLabel}> CARBS </Text>
              </View>
              <View style={styles.macrosColumn}>
                <TextInput
                  style={styles.macrosData}
                  value={this.state.fats + ""}
                />
                <Text style={styles.macrosLabel}> FATS </Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              {this.state.extendedIngredients &&
              this.state.extendedIngredients.length > 0 ? (
                this.renderIngredientsList()
              ) : (
                <Text style={styles.emptyListText}>
                  There are no ingredients to show.
                </Text>
              )}
              <TouchableOpacity
                style={styles.compareButton}
                onPress={this.toggleComparisonModal}
              >
                <Text style={styles.compareText}>Compare To Food Stock</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              {this.state.instructions && this.state.instructions.length > 0 ? (
                this.renderInstructionsList()
              ) : (
                <Text style={styles.emptyListText}>
                  There are no instructions to show.
                </Text>
              )}
            </View>
          </View>
          <View style={styles.whitespaceBuffer} />
        </ScrollView>
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

  divider: {
    backgroundColor: "blue"
  },

  recipeRow: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    justifyContent: "center", // Used to set Text Component Vertically Center
    alignItems: "center" // Used to set Text Component Horizontally Center
  },

  contents: {
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("1%")
  },

  editButton: {
    paddingTop: hPercentage("1%"),
    paddingLeft: wPercentage("2%"),
    paddingRight: wPercentage("2%"),
    textDecorationLine: "underline",
    fontSize: 15,
    color: "black"
  },

  /*------------------------------------------------------------------------
    Top Section
    ------------------------------------------------------------------------*/
  topContainer: {
    width: "100%",
    height: 80,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "rgba(244, 238, 238, 0.5)",
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
    flex: 1,
    width: "100%",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  },
  searchResult: {
    width: "100%"
  },

  /*------------------------------------------------------------------------
    Recipe Info Section
    ------------------------------------------------------------------------*/
  overlayButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "flex-end",
    bottom: 0,
    right: 0,
    paddingTop: hPercentage("1%"),
    paddingBottom: hPercentage("3%"),
    paddingRight: wPercentage("1%"),
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)"
  },

  overlayButtons: {
    paddingTop: hPercentage("0.5%"),
    paddingRight: wPercentage("5%")
  },

  recipeContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)"
  },

  image: {
    //position: 'relative',
    width: "100%",
    height: 300
  },

  // @CT
  recipeTitleContainer: {
    marginTop: hPercentage("-1%"),
    paddingTop: hPercentage("2%"),
    backgroundColor: "rgba(255,255,255,1)"
  },

  //@CT
  recipeTitle: {
    width: wPercentage("65%"),
    maxHeight: hPercentage("5%"),
    marginLeft: wPercentage("7%"),
    marginRight: wPercentage("8%"),
    fontSize: 20,
    fontWeight: "500",
    color: "rgba(181, 83, 102, 1)" // Medium Pink
  },

  statsContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("2%"),
    marginLeft: wPercentage("3%")
  },

  stats: {
    fontSize: 18,
    color: "rgba(0,0,0, 0.8)",
    marginLeft: wPercentage("3%")
  },

  statsIcon: {
    marginTop: wPercentage("1%"),
    marginLeft: wPercentage("5%"),
    fontSize: 18,
    color: "rgba(0,0,0, 0.5)"
  },

  /*------------------------------------------------------------------------
        Macros Styles
    ------------------------------------------------------------------------*/

  macrosContainer: {
    paddingTop: hPercentage("2%"),
    marginBottom: hPercentage("2%"),
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: 80,
    backgroundColor: "rgba(255,255,255,1)"
  },

  macrosLabel: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400"
  },

  macrosData: {
    textAlign: "center",
    fontSize: 15
  },

  /*------------------------------------------------------------------------
        Recipes Styles
    ------------------------------------------------------------------------*/

  sectionContainer: {
    marginBottom: hPercentage("3%"),
    paddingTop: hPercentage("1%"),
    backgroundColor: "rgba(255,255,255,1)"
  },

  sectionTitle: {
    flex: 1,
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("2%"),
    marginLeft: wPercentage("7%"), //
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(0,0,0,1)"
  },

  emptyListText: {
    marginLeft: wPercentage("7%"),
    marginTop: hPercentage("2%"),
    marginBottom: hPercentage("2%")
  },

  swipeIndicator: {
    paddingRight: wPercentage("4%"),
    paddingLeft: wPercentage("1.5%")
  },
  /*------------------------------------------------------------------------
        Ingredients Styles
    ------------------------------------------------------------------------*/
  addIcon: {
    paddingTop: hPercentage("2%"), //10
    paddingRight: wPercentage("7%") //30
  },

  compareButton: {
    marginTop: hPercentage("3%"),
    marginBottom: hPercentage("2%"),
    marginRight: wPercentage("5%"),
    marginLeft: wPercentage("5%")
  },

  compareText: {
    fontSize: 15,
    fontWeight: "500",
    width: "100%",
    color: "rgba(58, 170, 170, 1)",
    textAlign: "center"
  },

  ingredientText: {
    fontSize: 14,
    marginLeft: wPercentage("4%"),
    marginBottom: -15,
    color: "rgba(105,105,105,1)"
  },

  amountText: {
    width: "100%",
    fontStyle: "italic",
    marginRight: wPercentage("10%"), //20
    marginBottom: -15
  },

  /*------------------------------------------------------------------------
        Instructions Styles
    ------------------------------------------------------------------------*/

  instructionStepContainer: {
    marginRight: 35,
    marginLeft: "-100%",
    justifyContent: "flex-start"
  },

  instructionStep: {
    width: "100%",
    fontSize: 16
  },

  numberContainer: {
    marginLeft: wPercentage("7%"),
    marginRight: wPercentage("8%")
  },

  numberBadge: {
    backgroundColor: "rgba(68, 72, 76, 0.6)",
    borderRadius: 100,
    width: 30,
    height: 30
  },

  instructionNumber: {
    width: "100%",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center"
  }
});
