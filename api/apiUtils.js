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
    getRecipeInfoFromId,
    getRandomFoodTrivia
}