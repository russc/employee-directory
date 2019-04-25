import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Menu = styled(Paper)`
  padding: 1rem;
  position: absolute;
  left: 27px;
  top: 52px;
`;

const Page = styled(ListItem)`
  &:hover {
    cursor: pointer;
    background: lavender;
  }
`;
const navigate = (url, history) => {
  history.push(url);
};

const Nav = ({ routes, history, small }) => (
  <Menu>
    {small === true ? (
      <List>
        {routes.map((route, i) => (
          <Page key={i} onClick={() => navigate(route.path, history)}>
            {route.name}
          </Page>
        ))}
      </List>
    ) : (
      routes.map((route, i) => (
        // <p key={i} style={{ marginRight: "20px" }}>
        <Link to={route.path} key={i}>
          {route.name}
        </Link>
        // </p>
      ))
    )}
  </Menu>
);

export default Nav;
