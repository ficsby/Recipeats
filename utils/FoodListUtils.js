import { firebaseApp } from "./../App";
import FoodList from "../data/FoodList";
import * as firebase from "firebase";
import { value } from "react-native-extended-stylesheet";

/**
 * Comparison function to find missing FoodItem objects between two arrays
 * @param {array} firstList - list of needed ingredients
 * @param {array} secondList - list to check for missing needed ingredients
 */
export const findMissingFoodItems = (firstList, secondList) => {
  const secondListIds = secondList.map(f => f.id);
  return firstList.filter(foodItem => !secondListIds.includes(foodItem.id));
};

/**
 * Comparison function to find similar FoodItem objects between two arrays
 * @param {array} firstList - list of needed ingredients
 * @param {array} secondList - list to check for missing needed ingredients
 */
export const findSimilarFoodItems = (firstList, secondList) => {
	const secondListIds = secondList.map(f => f.id);
	return firstList.filter(foodItem => secondListIds.includes(foodItem.id));
  };

/**
 * Function to subtract ingredient amounts in the first array from the second array and returns the resulting array.
 * This method assumes that both lists contain the same ingredients.
 * @param {array} firstList
 * @param {array} secondList
 */
export const subtractFoodList = (firstList, secondList) => {
    const subtractAmounts = secondList.map(f => f.amount);
  firstList.map(foodItem => foodItem.amount)
};

/**
 * Function that gets a user's food stock from firebase
 * @param {*} userId - The user id of the user whose food stock you want
 */
export const getFoodList = userId => {
  ref = firebase.database().ref("foodlist/" + userId + "/");
  //return ref.once("value", (snapshot) => console.log(snapshot.val()) );
  return ref;
};

/**
 * Function to add a new food item to a user's food inventory in the database
 * @param {*} userId - User's user ID
 * @param {*} foodItemID - ID of the food item being added to the food stock
 * @param {*} amount - The amount of food item being added to food stock
 * @param {*} unit - The unit of measurement for the food item
 */
export const modifyFoodStock = (userId, foodItemName, foodItemID, price, amount, unit, datePurchased, tableData) => {
    
    firebase.database().ref('foodlist/' + userId + '/' + foodItemName + '_' + foodItemID).update({
        id: foodItemID,
        name: foodItemName,
        amount: amount,
		unit: unit,
		price: price,
		datePurchased: datePurchased,
		tableData: tableData
    });
};

/**
 * Function to remove a food item from a user's food inventory in the database
 * @param {string} userId - user id of the foodstock to delete from
 * @param {int} foodItemId - id of the food item to be removed
 */
export const removeFromFoodStock = (userId, foodItemName, foodItemID) => {
  firebase
    .database()
    .ref("foodlist/" + userId + "/" + foodItemName + "_" + foodItemID)
    .remove();
};

/**
 * Function to log the date a food item was purchased to the database
 * @param {*} userId
 * @param {*} foodItemID
 * @param {*} date
 */
export const logPurchaseDate = (userId, foodItemID, date) => {
  firebase
    .database()
    .ref("purchaseDates/" + userId)
    .set({
      [foodItemID]: date
    });
};

/**
 * Generic mapper function that maps a list of values
 * to create a list of different values
 * @param {*} transform - function that transforms a single item in the list
 * @param {*} foodlist  - list to be mapped
 */
const mapFoodlist = (transform, foodlist) => {
  result = [];
  for (var item in foodlist) {
    result.push(transform(item));
  }

  return result;
};

/**
 * Function to get the prices of fooditems in a foodlist
 * @param {*} foodlist - foodlist that you want prices from
 */
export const getPrices = foodlist => {
  return mapFoodlist(fooditem => fooditem.price, foodlist);
};

/**
 * Generic reducer function
 * @param {*} reducer - reducer function used to aggregate values
 * @param {*} initial - initial value to start with
 * @param {*} list - list to aggregate from
 */
const reduce = (reducer, initial, list) => {
  result = initial;
  for (var item in list) {
    result = reducer(result, item);
  }

  return result;
};

/**
 * Function that returns the total value of a foodlist
 * @param {*} foodlist - foodlist that you want the total price of
 */
export const getTotalPrice = foodlist => {
  return reduce(
    (value, price) => {
      return (value = value + price);
    },
    0,
    getPrices(foodlist)
  );
};

/**
 * Function that returns the total value of a foodlist
 * @param {*} foodlist - foodlist that you want the total price of
 */
export const abbreviateUnit = unit => {
	switch(unit)
	{
		case 'milliliters':
			return 'mL';
		case 'liters':
			return 'L';
		case 'grams':
			return 'g';
		case 'milligrams':
			return 'mg';
		case 'kilograms':
			return 'kg';
		case 'teaspoons':
			return 'tsp';
		case 'tablespoons':
			return 'tbsp';
		case 'ounces':
			return 'oz';
		case 'pounds': 
			return 'lb';
		case 'pints':
			return 'pt';
		case 'quarts':
			return 'qt';
		case 'gallons':
			return 'gal';
		default:
			return 'unit';
	}
  };