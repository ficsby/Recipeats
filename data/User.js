import * as firebase from 'firebase';

export default class User {
    constructor(userID) {
        //get user data from firebase through userID
        var user = firebase.database().ref().child("users").child(userID);
        this.state = {
            userID: userID,
            username: user.username,
            name: user.name,
            email: user.email,
            weight: user.weight,
            birthDate: user.birthDate,
            activityLevel: user.activityLevel,
            foodStock: firebase.database().ref().child("foodlist").child(username)
        }
    }
}