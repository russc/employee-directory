/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import App from "./App";
import { client } from "./apollo";
import { Query, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

const hist = createBrowserHistory();
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const Login = () => <h1>Please login.</h1>;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) =>
        data.isLoggedIn ? (
          <Router history={hist}>
            <Switch>
              <Route
                path="/"
                render={({ history }) => (
                  <App client={client} history={history} />
                )}
              />

              <Redirect from="/" to="/employees" />
            </Switch>
          </Router>
        ) : (
          <Login />
        )
      }
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);
