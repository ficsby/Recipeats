import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDCW_405Lp7aIGkbu20VB_MXyyxSIYunsA",
    authDomain: "recipeats-70bcc.firebaseapp.com",
    databaseURL: "https://recipeats-70bcc.firebaseio.com",
    projectId: "recipeats-70bcc",
    storageBucket: "recipeats-70bcc.appspot.com",
    messagingSenderId: "814134605353"
  };
  const f_base = firebase.initializeApp(config);
export default f_base;