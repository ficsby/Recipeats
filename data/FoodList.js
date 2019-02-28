import * as firebase from 'firebase';

export default class FoodList {
    constructor(foodListID) {
        var owner = foodListID;

        //pull the foodList map from firebase and store as a map
        var list = firebase.database().ref().child("foodlist").child(foodListID);
    }
}