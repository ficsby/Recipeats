var unirest = require('unirest');
unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=10&offset=0&type=main+course&query=burgers")
.header("X-RapidAPI-Key", "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});