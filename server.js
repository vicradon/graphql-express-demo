const express = require('express');
const expressGraphQL = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');

const server = express();

server.use(cors());
server.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

server.listen('4000', () => {
  console.log('Server listening on localhost:4000')
});