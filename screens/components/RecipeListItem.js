import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Linking,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import Swipeout from "react-native-swipeout";
import {
  widthPercentageToDP as wPercentage,
  heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";
import NavigationService from "../../navigation/NavigationService.js";
import * as firebase from "firebase";
/* Custom Icons */
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "./../../config/icon-font.json";
const Icon = createIconSetFromFontello(fontelloConfig, "fontello");

// Fetch the necessary Components
import Button from "./Button";

class RecipeListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: this.props.parent,
      item: this.props.item,
      rowId: this.props.rowId,
      sectionId: this.props.sectionId,
      bookmarked: this.props.bookmarked
    };
    this.onPressItem = this.onPressItem.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
    this.showRecipeScreen = this.showRecipeScreen.bind(this);
  }

  showRecipeScreen(selectedRecipe) {
    NavigationService.navigate("RecipeScreen", {
      title: selectedRecipe.title,
      recipeId: selectedRecipe.id,
      bookmarked: this.state.bookmarked,
      image: this.state.item.image,
      instructions: selectedRecipe.instructions,
      extendedIngredients: selectedRecipe.extendedIngredients,
      calories: selectedRecipe.calories,
      protein: selectedRecipe.protein,
      carbs: selectedRecipe.carbs,
      fats: selectedRecipe.fats,
      readyInMinutes: selectedRecipe.readyInMinutes,
      servings: selectedRecipe.servings
    });
  }

  onPressItem() {
    this.showRecipeScreen(this.state.item);
  }

  /**
   * Function to remove a food item from a user's food inventory in the database
   * @param {string} userId - user id of the foodstock to delete from
   * @param {int} foodItemId - id of the food item to be removed
   */
  removeRecipe = () => {
    firebase
      .database()
      .ref("foodlist/" + userId + "/" + foodItemName + "_" + foodItemID)
      .remove();
  };

  onPressDelete() {
    const parent = this.props.parent;
    const id = this.props.item.id;
    Alert.alert(
      "Warning",
      "Are you sure you want to remove " +
        this.state.item.title +
        " from your recipe list?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            var temp = [];
            var userId = firebase.auth().currentUser.uid;
            switch (this.state.sectionId) {
              case 1:
                firebase
                  .database()
                  .ref(
                    "customRecipes/" +
                      userId +
                      "/" +
                      this.state.item.title +
                      "_" +
                      this.state.item.id
                  )
                  .remove();
                temp = [...this.props.parent.state.customRecipes];
                this.props.parent.setState({
                  customRecipes: temp.filter(
                    item => item.id != this.state.item.id
                  )
                });
                break;
              case 2:
                firebase
                  .database()
                  .ref(
                    "bookmarkedRecipes/" +
                      userId +
                      "/" +
                      this.state.item.title +
                      "_" +
                      this.state.item.id
                  )
                  .remove();
                temp = [...this.props.parent.state.bookmarkedRecipes];
                this.props.parent.setState({
                  bookmarkedRecipes: temp.filter(
                    item => item.id != this.state.item.id
                  )
                });
                break;
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  renderRecipes() {
    let number = (this.state.rowId + 1).toString();
    return (
      <Button
        style={{ backgroundColor: "white" }}
        key={this.state.rowId}
        noDefaultStyles={true}
        onPress={this.onPressItem}
      >
        <View style={styles.itemContainer}>
          <View style={styles.ItemDescription}>
            <View style={styles.number}>
              <Text style={styles.number}>{number}.</Text>
            </View>
            <View style={styles.detailsContainer}>
              {/* { getPretext(item) } */}
              <Text style={styles.title}>{this.state.item.title}</Text>
              <View
                style={{ flexDirection: "row", marginTop: hPercentage("5%") }}
              >
                <Text>{this.state.item.servings}</Text>
                <Text
                  style={{
                    marginLeft: wPercentage("1%"),
                    marginRight: wPercentage("2%")
                  }}
                >
                  servings
                </Text>
                <Text>{this.state.item.readyInMinutes}</Text>
                <Text
                  style={{
                    marginLeft: wPercentage("1%"),
                    marginRight: wPercentage("1%")
                  }}
                >
                  mins
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.photoContainer}>
            {this.state.item.image ? (
              <Image
                source={{ uri: this.state.item.image }}
                style={styles.photo}
              />
            ) : (
              <Image
                source={require("./../../assets/images/default_image_0.png")}
                style={styles.photo}
              />
            )}
          </View>
          <View style={{ marginRight: wPercentage("2%") }}>
            <Icon name="left-open" size={17} color={"grey"} />
          </View>
        </View>
      </Button>
    );
  }

  render() {
    const swipeSettings = {
      autoClose: true,
      right: [
        {
          onPress: () => {
            this.onPressDelete();
          },
          text: "Delete",
          type: "delete"
        }
      ],
      rowId: this.props.rowId,
      sectionId: this.props.sectionId
    };
    return (
      <Swipeout
        {...swipeSettings}
        style={{ backgroundColor: "rgb(247, 247, 247)" }}
      >
        {this.renderRecipes()}
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: hPercentage("2%"),
    paddingBottom: hPercentage("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4"
  },
  ItemDescription: {
    flex: 2,
    flexDirection: "row",
    // paddingTop: hPercentage('1%'),
    // paddingBottom: hPercentage('5%'),
    marginLeft: wPercentage("7%")
  },
  number: {
    flex: 0.5
  },
  detailsContainer: {
    flex: 3
  },
  pretext: {
    color: "#3F3F3F",
    fontSize: 20
  },
  title: {
    width: wPercentage("50%"),
    fontSize: 18,
    fontWeight: "400",
    color: "rgb(42, 44, 48)"
    // fontFamily: 'georgia'
  },
  photoContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
    marginRight: wPercentage("10%")
  },
  photo: {
    width: wPercentage("30%"),
    height: hPercentage("10%")
  }
});

export default RecipeListItem;
