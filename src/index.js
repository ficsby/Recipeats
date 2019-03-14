const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");


var unirest = require('unirest');


// unirest.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/9266/information?amount=100&unit=gram`)
// .header("X-RapidAPI-Key", "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
// .end(function (result) {
//     console.log(result.body.name);
//     });


const typeDefs = `
  type Query {
    hello(name: String): String!
    getFoodItem(id: Int): String
  }

  type FoodItem {
    id: Int
    name: String
  }
`;

const resolvers = {

    FoodItem: {

    },

    Query: {
        hello: (_, { name }) => `Hello ${name || "World"}`,
        getFoodItem: async (_, {id}) => {
        const response = await unirest.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${id}/information?amount=100&unit=gram`)
        .header("X-RapidAPI-Key", "14a82f14fbmsh3185b492f556006p1c82d1jsn4b2cf95864f2")
        .end(function (result) {
            console.log(result.body.name);
            return result.body.name;
            });
        return response.json();
        },
    }
};

const server = new GraphQLServer({ typeDefs, resolvers});
server.start( () => console.log("Server is running on localhost:4000"));

