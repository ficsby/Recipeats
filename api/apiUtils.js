const fetch = require('node-fetch');
const API_KEY = "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2";
// var shuffle = require('shuffle-array');


// /* <Francis Buendia> March 15, 2019
//         API Request call to 'Autocomplete recipe search' recipes by name 
// */
// async function getAutoCompleteRecipesByName(text, context){

//     try{
        
//         // Returns a promise which then gets the result from the request call
//         const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete?number=10&query=${text}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
//             },
//         });

//         const json = await response.json();
//         context.setState({recipes: json});
        
//     } catch (err) {
//         console.log(err);
//     }
    
// }

// /**
//  * API request call to 'Autocomplete ingredients search' ingredients by name
//  * @param {*} text - text to autocomplete
//  * @param {*} context - Reference to the object that the function is called in
//  */
// async function getAutoCompleteIngredientsByName(text, context) {
//     try {
//         // Returns a promise which then gets the result from the request call
//         const response = await fetch(
//           `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?number=10&metaInformation=true&query=${text}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "X-RapidAPI-Key": API_KEY // API key registered for Spoonacular API
//             }
//           }
//         );

//         const json = await response.json();
//         context.setState({ ingredients: json });
//     } catch (err) {
//         console.log(err);
//     }
// }

/* <Francis Buendia> March 15, 2019
        API Request call to 'Get Recipe Info from Id' to get the recipe information
*/
async function getRecipeInfoFromId(id, context){
    console.log("api call going out #3");
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

// async function searchRecipeByName(name, cuisine, diet, intolerances, context){
//     console.log('in search recipe');
//     // let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?cuisine=${cuisine}&diet=${diet}&excludeIngredients=''&intolerances=${intolerances}&number=10&offset=0&type=main+course&query=${name}`;
//     // console.log(url);
//     // //https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?cuisine=thai&diet=vegetarian&excludeIngredients=coconut&intolerances=egg%2C+gluten&number=10&offset=0&type=main+course&query=burger
//     // //"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?cuisine=thai&diet=vegetarian&excludeIngredients=coconut&intolerances=egg%2C+gluten&number=10&offset=0&type=main+course&query=burger"
//     // const response = await fetch(url, {
//     //     method: "GET",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //         "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
//     //     },
//     // });
//     // console.log(response);
//     // const json = await response.json();
//     // console.log(json);
// }

/**
 * API request call to "Get food information" to get information about a specific food (ingredient)
 * @param {int} id - API ID of the food
 * @param {reference} context - Reference to the object that the function is called in
 */
async function getIngredientInfoFromId(id, amnt, context) {
    // Returns a promise which then gets the result from the request call
    const response = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${id}/information?amount=${amnt}&unit=gram`,
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
        nutritionTags = {}
        for (key in json) {
			
            if (key in context.state) {
                context.setState({
                    [key]: json[key]
                });
            }
            else {
				if(key == 'nutrition')
				{
					nutrients = json[key]['nutrients'];
					caloricBreakdown = json[key]['caloricBreakdown'];
					
					var tableData = [];
					for(nutridx in nutrients){
						nutrData = nutrients[nutridx];
						console.log(nutrients[nutridx]);
						tableData.push([nutrData['title'], nutrData['amount'], nutrData['unit'], nutrData['percentOfDailyNeeds']]);
					}
					
					console.log(tableData);
					context.setState({
						tableData: tableData
					});
				}
				
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

// /* <Francis Buendia> March 15, 2019
//         API Request call to 'Get Random Food Trivia' to get food trivia info
// */
// /**
//  * Random food trivia
//  * @param {reference} context 
//  */
// async function getRandomFoodTrivia(context){
//     // Returns a promise which then gets the result from the request call
//     const response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/trivia/random`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
//         },
//     });

//     const json = await response.json();
//     // Check if component is mounted before changing state, this check is to prevent memory leaks
//     if(context._ismounted)
//     {
//         context.setState({food_trivia: json.text});
//     };

//     return new Promise((resolve) => setTimeout( () => { resolve('result') }, 5000 ) );
// }


// /* <Christine Tran> March 28, 2019
//         API Request call to 'Search Site Content" in order to get food articles
// */
// async function getRandomFoodArticles(context){
//     searchKeys = ['restaurant', 'easy', 'breakfast', 'kitchen', 'where', 'food', 'avoid', 'why', 'best', 'healthy', 'when', 'how', 'bread', 'cheese', 'protein', 'fruit', 'dessert', 'snack', 'candy', 'dinner'];
//     shuffle(searchKeys);
//     console.log(searchKeys);
//     // Returns a promise which then gets the result from the request call
//     const foodArticles = [];

//     for (idx=0; idx < searchKeys.length; ++idx)
//     {
//         const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/site/search?query='+ searchKeys[idx], {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
//             },
//         });
//         const json = await response.json();

//         for (jdx=0; jdx < json.Articles.length; ++jdx)
//         {
//             if (json.Articles[jdx].image != null)
//             {
//                 foodArticles.push({ 'title': json.Articles[jdx].name,
//                                     'image': json.Articles[jdx].image,
//                                     'link':  json.Articles[jdx].link  })
//             }
//         }  
//     }

//     // Check if component is mounted before changing state, this check is to prevent memory leaks
//     if(context._ismounted)
//     {
//        context.setState({ article_items: foodArticles });
//     }

//     return new Promise((resolve) => setTimeout( () => { resolve('result') }, 5000 ) );

// }

// /* <Christine Tran> March 28, 2019
//     API Request call to 'Get Random Food Video' to get food videos
// */
// async function getRandomFoodVideos(context){
//     // Returns a promise which then gets the result from the request call
//     // randomCuisine = cusines[(Math.random() * cuisines.length) | 0];
//     // cuisineUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?cuisine=' + randomCuisine + '&minLength=0&maxLength=999&offset=0&number=10';
//     // cuisineUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?cuisine=chinese&minLength=0&maxLength=999&offset=0&number=10';
//     const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?type=main+course&minLength=0&maxLength=999&offset=0&number=10', {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "X-RapidAPI-Key" : API_KEY     // API key registered for Spoonacular API
//         },
//     });
//     const json = await response.json();
//     const foodVideoObjects = json.videos;
//     const videoTags = new Set(['shortTitle', 'youTubeId', 'thumbnail']);

//      // Check if component is mounted before changing state, this check is to prevent memory leaks
//      if(context._ismounted)
//      {
//         const foodVideos = [];
//         for(idx in foodVideoObjects)
//         {   
//             object = foodVideoObjects[idx];
//             video = {};
//             for(key in object)
//             {
//                 if(videoTags.has(key))
//                 {
//                     video[key] = object[key];
//                 }
//             }
//             foodVideos.push(video);
//         }
//         shuffle(foodVideos);

//         context.setState({
//             video_items: 
//             [
//                 {
//                     pretext: '',
//                     title: foodVideos[0].shortTitle,
//                     summary: '',
//                     videoId: foodVideos[0].youTubeId,
//                     image: '',
//                 },
//                 {
//                     pretext: '',
//                     title: foodVideos[1].shortTitle,
//                     summary: '',
//                     videoId: foodVideos[1].youTubeId,
//                     image: '',
//                 },
//                 {
//                     pretext: '',
//                     title: foodVideos[2].shortTitle,
//                     summary: '',
//                     videoId: foodVideos[2].youTubeId,
//                     image: '',
//                 },
//                 {
//                     pretext: '',
//                     title: foodVideos[3].shortTitle,
//                     summary: '',
//                     videoId: foodVideos[3].youTubeId,
//                     image: '',
//                 },
//                 {
//                     pretext: '',
//                     title: foodVideos[4].shortTitle,
//                     summary: '',
//                     videoId: foodVideos[4].youTubeId,
//                     image: '',
//                 }
//             ]
//         });
//     }
//     return new Promise((resolve) => setTimeout( () => { resolve('result') }, 5000 ) );
// }

export default {
    // getAutoCompleteRecipesByName,
    // getAutoCompleteIngredientsByName,
    // getRecipeInfoFromId,
    // getRandomFoodTrivia,
    // getRandomFoodVideos,
    // getRandomFoodArticles,
    // searchRecipeByName,
    getIngredientInfoFromId,
}