import * as firebase from 'firebase';

export default class FoodList {
    constructor(foodListID) {
        var owner = foodListID;

        //pull the foodList map from firebase and store as a map
        this.list = firebase.database().ref().child("foodlist").child(foodListID);
    }

    //compares two different FoodLists and
    //returns a FoodList containing missing FoodItems
    compare(secondList) {
        
    }
}