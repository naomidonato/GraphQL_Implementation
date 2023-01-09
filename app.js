const express = require('express');

//adding graphQL to the server
//express graphQL is in the package.json
const expressGraphQL = require('express-graphql').graphqlHTTP;

//To Create a Query
//import these object types from the graphQL library 
const {
    GraphQLSchema, 
    GraphQLObjectType, //allows you to create a dynamic object with different types
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

//A Schema is created by supplying the root types of each type of operation, query and mutation (optional)

const app = express(); //invoke that function to create our app

const authors = [
    { id: 1, name: "John Green", age: 45, almaMater: "Kenyon College" },
    { id: 2, name: "Roald Dahl", age: 74, almaMater: "Repton School" },
    { id: 3, name: "J.K. Rowling", age: 57, almaMater: "University of Exeter" },
    { id: 4, name: "Yann Martel", age: 59, almaMater: "Trent University" }
]

const books = [
    { id: 1, name: "The Fault in our Stars", authorId: 1 },
    { id: 2, name: "Paper Towns", authorId: 1 },
    { id: 3, name: "Going Solo", authorId: 2 },
    { id: 4, name: "Matilda", authorId: 2 },
    { id: 5, name: "Harry Potter and the Goblet of Fire", authorId: 3},
    { id: 6, name: "Harry Potter and the Prisoner of Azkaban", authorId: 3},
    { id: 7, name: "Life of Pi", authorId: 4 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Represents a book written by an author',
    fields: () => ({ //defines the fields before they are called
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: { //how we are able to achieve nested queries
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'Represents author of a book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        almaMater: { type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: { //single book
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {  //list of books
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },
        authors: { //list of authors
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(bathorook => author.id === args.id)
        }
    }) 
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId}
                books.push(book) //pushes the book to the array
                return book
            }
        }
    })
})

//You'll need to pass in a schema into the expressGraphQL function
//so that the API knows what the data looks like
// a schema provides a root type for each kind of operation
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

//Root for application
app.use('/graphql', expressGraphQL({
    schema: schema, //pass the schema into the function here to access the graphQL interface
    graphiql: true //graphiql gives a user interface to access our graphQL server without having to 
                    //manually call it through something like postman
   
}))

app.listen(4000, () => console.log('now listening for requests on port 4000'))

