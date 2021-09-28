/* All GraphQL APIs require the schema description. */
const graphql = require('graphql');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql; 

//dummy
let books = [
    {name: 'Big Women', genre: 'sci-fi', id: "1"},
    {name: 'The Libertarian Ideal', genre: 'sci-fi', id: "2"},
    {name: 'My Life', genre: 'real', id: "3"}
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
    /* A function is needed bc when we have multiple
       inter-referencing fields, one field may not now
       about another field's type */
       id: {type: GraphQLString }, 
       name: { type: GraphQLString },
       genre: { type: GraphQLString }
    /* Strict typing allows us to overcome 
       multiple type ref errors */
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
        /*  Args are required parameters for query.
            Must be consistent with previously defined fields. */
            args: {id: {type: GraphQLString}}, 
        /*  Resolve function defines logic for data retrieval.
            Grabs from db or other source. */
            resolve(parent, args){
                return _.find(books, {id: args.id});
            }
        }
     }
 })

module.exports = new GraphQLSchema({
    query: RootQuery
})