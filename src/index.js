/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import App from "./App";
import { client } from "./apollo";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

const hist = createBrowserHistory();

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={hist}>
      <Switch>
        <Route
          path="/"
          render={({ history }) => <App client={client} history={history} />}
        />
        <Redirect from="/" to="/employees" />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
