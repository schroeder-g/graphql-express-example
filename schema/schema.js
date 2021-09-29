/* All GraphQL APIs require the schema description. 
    The Schema provides a nice parallelism for 

*/
const graphql = require('graphql');
const _ = require('lodash');
const shID = require('shortid')
const { 
    GraphQLSchema,
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt, 
    GraphQLID,
    GraphQLList,
} = graphql; 

//dummy
let books = [
    {title: 'The Union', genre: 'sci-fi', authorId: "1", id: "1"},
    {title: 'The Libertarian Ideal', genre: 'sci-fi', authorId: "2", id: "2" },
    {title: 'To Fields on Io', genre: 'biography', authorId: "3",  id: "3"},
    {title: "The Winter of Our Discontent", genre: 'fiction', authorId: 5 ,  id: "4"},
    {title: "Swann's Way", genre: 'fiction', authorId: "4",  id: "5"},
    {title: "Grapes of Wrath", genre: 'fiction', authorId: "5",  id: "6"}

]

let authors = [
    {name:'Donald Mikado', age:'26', id: "1", books: {}}, //IDs don't have to (but probably should) share types
    {name:'Samuel P. Clemens', age:'100', id: "2"},
    {name:'Reb Monk', age:'100', id: "3", books:{ }},
    {name:'Marcel Proust', age:'980', id: "4", books:{ }},
    {name:'John Steinbeck', age:'98', id: "5", books:{ }}
]

/* Strict typing allows us to overcome 
multiple type ref errors */
const AuthorType = new GraphQLObjectType({ 
    name: 'Author',
    fields: () => ({ // A function to handle asynchronicity (allowing all entities to resolve first)
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: { type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, { authorId : parent.id })
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ 
    /* An obj method is needed to handle inter-referencing fields, and mixed */
       id: {type: GraphQLID }, //GQLID purely for GQL benefit; can be string
       title: { type: GraphQLString },
       genre: { type: GraphQLString },
       author: {
           type: AuthorType,
           resolve(parent, args){
               console.log(parent)
               return _.find(authors, {id: parent.authorId})
           } // GraphQLFieldResolver(source: any, args: { [argName: string]: any; },
       }
    /* */
    })
})

/* Root Queries describe how users can 'jump into' 
 the graph and query objects */
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
     // Every query belong in the 'fields' key.
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}}, 
            resolve(parent, args){
                return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}}, 
            resolve(parent, args){ 
                return _.find(authors, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors
            }
        }

    }
 })

module.exports = new GraphQLSchema({
    query: RootQuery
})