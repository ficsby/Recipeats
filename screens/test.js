var unirest = require('unirest');
const fetch = require("node-fetch");
//var fetch = require('fetch');
// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=chicken")
//         .header("X-RapidAPI-Key", "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
//         .end(function (result) {
//         console.log(result.body[0].title);
// });

fetch("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=chicken", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key" : "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2"
    },
}).then(function(response) {
    response.json().then(function(json){
        console.log(json);
    });
});

//console.log(test);

