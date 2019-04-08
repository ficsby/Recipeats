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
/**
 * Random food trivia
 * @param {reference} context 
 */
async function getRandomFoodTrivia(context){
    // Returns a promise which then gets the result from the request call
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


/* <Christine Tran> March 28, 2019
        API Request call to 'Search Site Content" in order to get food articles
*/
async function getRandomFoodArticles(context){
    // searchKeys = ['what', 'why', 'when', 'how', 'best', 'most', 'healthy', 'food', 'avoid',  'bread', 'cheese', 'protein', 'fruit', 'dessert', 'snack', 'candy', 'dinner', 'restaurant', 'easy', 'breakfast', 'kitchen', 'where'];
    searchKeys = ['what'];
    // Returns a promise which then gets the result from the request call
    const foodArticles = [];

    for (idx=0; idx < searchKeys.length; ++idx)
    {
        const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/site/search?query='+ searchKeys[idx], {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
            },
        });
        const json = await response.json();

        for (jdx=0; jdx < json.Articles.length; ++jdx)
        {
            foodArticles.push({ 'title':  json.Articles[jdx].name,
                                'image':  json.Articles[jdx].image,
                                'link':  json.Articles[jdx].link  })
        }  
    }

     // Check if component is mounted before changing state, this check is to prevent memory leaks
     if(context._ismounted)
     {
        context.setState({ article_items: foodArticles });
     }

    return new Promise((resolve) =>
        setTimeout(
        () => { resolve('result') },
        5000
        )
    );
}

/* <Christine Tran> March 28, 2019
    API Request call to 'Get Random Food Video' to get food videos
*/
async function getRandomFoodVideos(context){
    // Returns a promise which then gets the result from the request call
    // randomCuisine = cusines[(Math.random() * cuisines.length) | 0];
    // cuisineUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?cuisine=' + randomCuisine + '&minLength=0&maxLength=999&offset=0&number=10';
    // cuisineUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?cuisine=chinese&minLength=0&maxLength=999&offset=0&number=10';
    const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?type=main+course&minLength=0&maxLength=999&offset=0&number=10', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
        },
    });
    const json = await response.json();
    const foodVideoObjects = json.videos;
    const videoTags = new Set(['shortTitle', 'youTubeId', 'thumbnail']);

     // Check if component is mounted before changing state, this check is to prevent memory leaks
     if(context._ismounted)
     {
        const foodVideos = [];
        for(idx in foodVideoObjects)
        {   
            object = foodVideoObjects[idx];
            video = {};
            for(key in object)
            {
                if(videoTags.has(key))
                {
                    video[key] = object[key];
                }
            }
            foodVideos.push(video);
        }

        context.setState({
            video_items: 
            [
                {
                    pretext: '',
                    title: foodVideos[0].shortTitle,
                    summary: '',
                    videoId: foodVideos[0].youTubeId,
                    image: '',
                },
                {
                    pretext: '',
                    title: foodVideos[1].shortTitle,
                    summary: '',
                    videoId: foodVideos[1].youTubeId,
                    image: '',
                },
                {
                    pretext: '',
                    title: foodVideos[2].shortTitle,
                    summary: '',
                    videoId: foodVideos[2].youTubeId,
                    image: '',
                },
                {
                    pretext: '',
                    title: foodVideos[3].shortTitle,
                    summary: '',
                    videoId: foodVideos[3].youTubeId,
                    image: '',
                },
                {
                    pretext: '',
                    title: foodVideos[4].shortTitle,
                    summary: '',
                    videoId: foodVideos[4].youTubeId,
                    image: '',
                }
            ]
        });

     }
    return new Promise((resolve) =>
        setTimeout(
        () => { resolve('result') },
        5000
        )
    );
}

export default {
    getAutoCompleteRecipesByName,
    getRecipeInfoFromId,
    getRandomFoodTrivia,
    getRandomFoodVideos,
    getRandomFoodArticles
}