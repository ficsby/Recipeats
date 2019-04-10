const fetch = require('node-fetch');
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";


/* <Francis Buendia> March 15, 2019
        API Request call to 'Autocomplete recipe search' recipes by name 
*/
async function getAutoCompleteRecipesByName(text, context){

    try{
        // Returns a promise which then gets the result from the request call
        const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=${text}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
            },
        });

        const json = await response.json();
        context.setState({recipes: json});
        
    } catch (err) {
        console.log(err);
    }
    
}

/**
 * API request call to 'Autocomplete ingredients search' ingredients by name
 * @param {*} text - text to autocomplete
 * @param {*} context - Reference to the object that the function is called in
 */
async function getAutoCompleteIngredientsByName(text, context) {
    try {
        // Returns a promise which then gets the result from the request call
        const response = await fetch(
          `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?number=10&metaInformation=true&query=${text}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Key": API_KEY // API key registered for Spoonacular API
            }
          }
        );

        const json = await response.json();
        context.setState({ ingredients: json });
    } catch (err) {
        console.log(err);
    }
}

/* <Francis Buendia> March 15, 2019
        API Request call to 'Get Recipe Info from Id' to get the recipe information
*/
async function getRecipeInfoFromId(id, context){
    // Returns a promise which then gets the result from the request call
    const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
        },
    });

    const json = await response.json();
    
    // Check if component is mounted before changing state, this check is to prevent memory leaks
    if(context._ismounted)
    {
        nutrtionTags = {}
        for(key in json)
        {   
            if(key in context.state){
                context.setState({
                    [key]: json[key]
                });
            }
            else if(key in context.state.nutritionalTags)
            {
                nutrtionTags[key] = json[key];
            }
        }

        context.setState({
            nutritionalTags: nutrtionTags
        });
    }

    return new Promise((resolve) =>
        setTimeout(
        () => { resolve('result') },
        5000
        )
    );
}

/**
 * API request call to "Get food information" to get information about a specific food (ingredient)
 * @param {int} id - API ID of the food
 * @param {reference} context - Reference to the object that the function is called in
 */
async function getIngredientInfoFromId(id, context) {
    // Returns a promise which then gets the result from the request call
    const response = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${id}/information?amount=100&unit=gram`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY // API key registered for Spoonacular API
        }
      }
    );

    const json = await response.json();

    // Check if component is mounted before changing state, this check is to prevent memory leaks
    if (context._ismounted) {
        console.log("context is mounted");
        nutritionTags = {}
        for (key in json) {
            if (key in context.state) {
                context.setState({
                    [key]: json[key]
                });
            }
            else {
                nutritionTags[key] = json[key];
                console.log(key + ": " + json[key]);
            }
        }

        context.setState({
            nutritionalTags: nutritionTags
        });
    }

    return new Promise((resolve) =>
        setTimeout(
            () => { resolve('result') },
            5000
        )
    );
}

/* <Francis Buendia> March 15, 2019
        API Request call to 'Get Random Food Trivia' to get food trivia info
*/
async function getRandomFoodTrivia(context){
    // Returns a promise which then gets the result from the request call HEREEEEEE
    const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/trivia/random`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
        },
    });

    const json = await response.json();
    // Check if component is mounted before changing state, this check is to prevent memory leaks
    if(context._ismounted)
    {
        context.setState({foodTrivia: json.text});
    }
}

export default {
    getAutoCompleteRecipesByName,
    getAutoCompleteIngredientsByName,
    getRecipeInfoFromId,
    getIngredientInfoFromId,
    getRandomFoodTrivia
}