import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import routes from "../../routes";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { StyledHeader } from "../StyledComponents/StyledComponents";

export default function Header({ history, setSearch, search, children }) {
  const [open, setOpen] = useState(false);
  const navigate = url => {
    history.push(url);
    setOpen(false);
  };

  return (
    <StyledHeader>
      <Hidden xsDown>
        <div>
          {routes.map((route, i) => (
            <Link to={route.path} key={i} style={{ marginRight: "20px" }}>
              {route.name}
            </Link>
          ))}
        </div>
      </Hidden>
      <Hidden smUp>
        <IconButton
          color="inherit"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <MenuIcon />
        </IconButton>
        {open === true && (
          <Paper style={{ position: "absolute", left: "27px", top: "52px" }}>
            <List>
              {routes.map((route, i) => (
                <ListItem key={i} onClick={() => navigate(route.name)}>
                  {route.name}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Hidden>
      {children}
    </StyledHeader>
  );
}
