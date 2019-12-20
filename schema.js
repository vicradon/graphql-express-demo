const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const customerType = new GraphQLObjectType({
  name:'customer',
  fields:() => ({
    id:{type:GraphQLString},
    name:{type:GraphQLString},
    email:{type:GraphQLString},
    age:{type:GraphQLInt}
  })
})

const query = new GraphQLObjectType({
  name:'query',
  fields:{
    customer:{
      type:customerType,
      args: {
        id:{type:GraphQLString}
      },
      resolve(parentValue, args){
        return axios.get(`http://localhost:5000${args.id}`)
          .then(res => res.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name:'mutation'
})

module.exports = new GraphQLSchema({
  query,
  // mutation:mutation
})