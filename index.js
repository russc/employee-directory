const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { RESTDataSource } = require("apollo-datasource-rest");

class EmployeesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://randomuser.me/api";
  }

  async getEmployees() {
    const { results } = await this.get("/?results=1000&nat=us&seed=postlight");
    return results;
  }
}

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Employee {
    gender: String
    email: String
    phone: String
  }

  type Query {
    hello: String
    employees: [Employee!]!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    employees: async (_, __, { dataSources }) =>
      dataSources.employeesAPI.getEmployees()
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    employeesAPI: new EmployeesAPI()
  })
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
