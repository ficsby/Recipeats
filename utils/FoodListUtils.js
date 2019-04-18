import { firebaseApp } from "./../App";
import FoodList from "../data/FoodList";
import * as firebase from "firebase";
import { value } from "react-native-extended-stylesheet";

/**
 * 
 * @param {*} secondList 
 */
export const findMissingFoodItems = (secondList) => {
    var myFoods = new FoodList();
    var missing = new Map();

    for (var [key, val] of secondList.list) {
        if (!myFoods.list.has(key)) {
            missing.set(key, val);
        }
    }

    return missing;
};

/**
 * 
 * @param {*} foodListID 
 */
export const getFoodList = (userId) => {
    ref = firebase.database().ref('users/' + userId + '/foodlist/');
    //return ref.once("value", (snapshot) => console.log(snapshot.val()) );
    return ref;
};

/**
 * Function to add a new food item to a user's food inventory in the database
 * @param {*} userId - User's user ID
 * @param {*} foodItemID - ID of the food item being added to the food stock
 * @param {*} quantity - The quantity of food item being added to food stock
 * @param {*} unit - The unit of measurement for the food item
 */
export const modifyFoodStock = (userId, foodItemID, foodItemName, quantity, unit) => {
    //console.log(foodItemID + ": " + quantity);
    firebase.database().ref('users/' + userId + '/foodlist/' + foodItemName + '_' + foodItemID).update({
        id: foodItemID,
        name: foodItemName,
        amount: quantity,
        unit: unit
    });
}

/**
 * Function to remove a food item from a user's food inventory in the database
 * @param {string} userId - user id of the foodstock to delete from
 * @param {int} foodItemId - id of the food item to be removed
 */
export const removeFromFoodStock = (userId, foodItemName, foodItemID) => {
	console.log('users/' + userId + '/foodlist/' + foodItemName + '_' + foodItemID);
    firebase.database().ref('users/' + userId + '/foodlist/' + foodItemName + '_' + foodItemID).remove();
}


/**
 * Function to log the date a food item was purchased to the database
 * @param {*} userId 
 * @param {*} foodItemID 
 * @param {*} date 
 */
export const logPurchaseDate = (userId, foodItemID, date) => {
    firebase.database().ref('purchaseDates/' + userId).set({
        [foodItemID]: date
    });
}

/**
 * 
 * @param {*} secondList 
 */
export const subtractFoodList = (secondList) => {
    var result = new FoodList();
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
}

/**
 * Function to get the prices of fooditems in a foodlist
 * @param {*} foodlist - foodlist that you want prices from
 */
export const getPrices = (foodlist) => {
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
export const getTotalPrice = (foodlist) => {
    return reduce(
        (value, price) => { return value = value + price; }, 0,
        getPrices(foodlist)
    );
};