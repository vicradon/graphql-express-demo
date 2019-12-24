const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const CustomerType = new GraphQLObjectType({
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
      type:CustomerType,
      args: {
        id:{type:GraphQLString}
      },
      resolve(parentValue, args){
        console.log(`http://localhost:3000/customers/${args.id}`)
        return axios.get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data)
      }
    },
    customers:{
      type:CustomerType,
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name:'mutation'
})

module.exports = new GraphQLSchema({
  query
  // mutation:mutation
})