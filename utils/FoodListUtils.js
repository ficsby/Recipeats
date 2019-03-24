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
export const getFoodList = (foodListID) => {
    //var newList = new FoodList();
    return firebase.database().ref().child("foodlist").child(foodListID);
    //newList.owner = foodListID;
    //return newList;
};

export const writeFoodList = (userId) => {
    firebase.database().ref('foodlist/' + userId).set({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
        weight: this.state.weight,
        activityLevel: this.state.activityLevel,
        birthDate: this.state.birthDate,
        selectedHeightMetric: this.state.selectedHeightMetric,
        selectedGender: this.state.selectedGender
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