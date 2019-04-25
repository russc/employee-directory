import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";

class App extends Component {
  state = {
    ...this.props
  };

  getRoutes = routes => {
    return routes.map((route, key) => {
      return (
        <Route
          path={route.path}
          render={() => <route.component {...this.state} />}
          key={key}
        />
      );
    });
  };

  render() {
    return <Switch>{this.getRoutes(routes)}</Switch>;
  }
}

export default App;
