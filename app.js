const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,  // ES6 shorthand for `schema: schema`
    graphiql: true // A handy GUI for interacting with our data
}));


app.listen(4000, () => {
    console.log('Now listening on port 4000')
})