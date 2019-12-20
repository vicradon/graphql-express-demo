# GraphQL How To
## Building a server using graphql, express, express-graphql and json-server

### Step 1 - Setting Up the Server
1. Set up the config in the server.js fle
2. You need express expressGraphQL, schema and cors.
```js
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');
const cors = require('cors');
```
Schema is a file which contains info on how the server responds to http verbs

3. Set up the server and  tell the server to use cors as a middleware
```javascript
const app = express();

app.use(cors());

```
4. Now, you need to tell the server to use express-graphql as a middleware
```javascript
app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));
```
The schema would be required and graphiql can be enabled

5. Finally, you need to start your server 
```javascript
app.listen(4000, () => {
    console.log('Server is running on port 4000..');
});
```

### Step 2 - Setting Up the Schema
The schema is reuired by express-graphql to do querying and mutations. The Schema uses classes from graphql to defined how data is manipulated

1. First, some things have to be enabled.
```js
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
```

GraphQL has its own data types and objects which define how the objects being queried or mutated are gonna be like.
You can see the various object types under the `GraphQLObjectType`. 

2. Now, for your data, you need to define types for your various data objects. In this example, the customer and customers data object were used. 

3. GraphQL requires that datatypes have to be decleared. Something like this
```js
const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
});
```
As you can see, there's a name and fields prop. The fields prop is a function which returns the type of objects that would be queried.
4. The root query is where almost half of the work lives. It contains the types of queries that can be performed.
The root query itself contains name and fields properties.
- The fields prop contain the types of queries that can be performed.
- In our demo, two queries can be performed. 
i. customer
ii. customers
5. Here comes the exciting part. In each query field, there are:
- A type prop specifying the type of query
- An args prop specifying the arguments that would be passed to the query
- The return object: Can be a function which returns an object. Most times, this function would be asynchronous. Here's a typical rootQuery
```js
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/customers/'+ args.id)
                    .then(res => res.data);

            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/customers')
                    .then(res => res.data);
            }
        }
    }
});
```

6. In graphiql, a query typically looks like this
```js
{
  customers{
    name, email, age, id
  }
}
```
7. Now, the root query handles get actions only. The three remaining main action types are:
- Post
- Patch, and 
- Delete
These are handled in another object called `mutation` created from the `GraphQLObjectType` class.
They are like then typical get query. Only difference is the http verb and the arguments passed.
The methods get, post, delete and patch already exist. All you need to do is pass in the correct fields to the object and the correct arguments to the funciton. 
Here's a typical mutation object
```js
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name:args.name,
                    email: args.email,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});
```

8. In graphiql, a mutation typically looks like this
```js
mutation {
  deleteCustomer(id:"rytP7hhUW" ){
    id, name, email
  }
}
```

Finally, a schema is exported carrying two args.
1. The query object
2. The mutation object