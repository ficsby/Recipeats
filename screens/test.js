var firebase = require('firebase');
var app = firebase.initializeApp({
                                  apiKey: "AIzaSyDCW_405Lp7aIGkbu20VB_MXyyxSIYunsA",
                                  authDomain: "recipeats-70bcc.firebaseapp.com",
                                  databaseURL: "https://recipeats-70bcc.firebaseio.com",
                                  projectId: "recipeats-70bcc",
                                  storageBucket: "recipeats-70bcc.appspot.com",
                                  messagingSenderId: "814134605353"
                                });
var csv = require('csv-parser'); 
const fs = require('file-system');

var MyData = [];

fs.createReadStream('C:\\Users\\franc\\OneDrive\\Desktop\\Recipeats\\data\\ingredients.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => MyData.push(data))
  .on('end', () => {
    fs.writeFile('Output.txt', MyData[0].ingredientName, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
  }) 
    // var user = firebase.auth().currentUser;
    // firebase.database().ref('ingredients/').set({
    //     ingredients : MyData
    // });
  });