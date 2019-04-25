/* eslint-disable no-unused-vars */
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const uri = "https://pl-employee-dir.herokuapp.com/v1alpha1/graphql";
const cache = new InMemoryCache();

export const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri
  })
});
