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
    age:{type:GraphQLInt},
    isMarried:{type:GraphQLString}
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
        console.log(`http://localhost:3000/customers/${args.id}`)
        return axios.get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data)
      }
    },
    customers:{
      type:new GraphQLList(customerType),
      resolve(){
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name:'mutation',
  fields: {
    addCustomer:{
      type:customerType,
      args: {
        name:{type:new GraphQLNonNull(GraphQLString)},
        email:{type:new GraphQLNonNull(GraphQLString)},
        age: {type:new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers/', args)
        .then(res => res.data)
      }
    },
    deleteCustomer: {
      type:customerType,
      args:{
        id:{type:new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
        .then(res => res.data)
      }
    },
    editCustomer: {
      type:customerType,
      args: {
        id: {type:new GraphQLNonNull(GraphQLString)},
        name: {type:new GraphQLNonNull(GraphQLString)},
        email: {type:new GraphQLNonNull(GraphQLString)},
        age: {type:new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parentValue, args){
        return axios.patch(`http://localhost:3000/customers/${args.id}`, args).then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query,
  mutation
})
