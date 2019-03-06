import FoodList from "../data/FoodList";
import * as firebase from "firebase";

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
    var newList = new FoodList();
    newList.list = firebase.database().ref().child("foodlist").child(foodListID);
    newList.owner = foodListID;
    return newList;
};

//subtracts the 
export const subtractFoodList = (secondList) => {
    var result = new FoodList();
};