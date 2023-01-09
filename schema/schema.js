const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString, GraphQLSchema} = graphql;

// dummy data
var movies = [
    { name: 'Forrest Gump', genre: 'comedy-drama', id: '123'},
    { name: 'Parasite', genre: 'horror', id: '456'},
    { name: 'The Imitation Game', genre: 'drama', id: '789'},
];


const MovieType = new GraphQLObjectType ({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        movie: {
            type: MovieType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args){
                //code to get data from db/other source         
            }
        }
    }
});

module.exports = new GraphQLSchema ({
    query: RootQuery
});