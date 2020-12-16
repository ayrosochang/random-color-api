const express = require("express")
const cors = require("cors")
const lowDb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const bodyParser = require("body-parser")
const { ApolloServer, gql } = require('apollo-server-express');

const db = lowDb(new FileSync('db.json'))

db.defaults({colors: []}).write()

const app = express()

app.use(cors())
app.use(bodyParser.json())

const typeDefs = gql`
  type Query {
    getAllColors: [String]
  }
`

const resolvers = {
  Query: {
    getAllColors: () => {
      return db.get("colors").value() 
    },
  },
}
 
const server = new ApolloServer({ typeDefs, resolvers });
 
server.applyMiddleware({ app })
 
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
