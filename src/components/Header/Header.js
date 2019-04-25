import React, { useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../routes";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { StyledHeader, MobileNav } from "../StyledComponents/StyledComponents";

export default function Header({ history, children }) {
  const [open, setOpen] = useState(false);
  const navigate = path => {
    history.push(path);
    setOpen(false);
  };

  return (
    <StyledHeader>
      <Hidden xsDown>
        <div>
          {routes.map((route, i) => (
            <Link
              to={route.path}
              key={i}
              style={{ marginRight: "20px" }}
              className={
                route.path === history.location.pathname ? "current" : ""
              }
            >
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
          <MobileNav>
            <List>
              {routes.map((route, i) => (
                <ListItem
                  key={i}
                  onClick={() => navigate(route.path)}
                  className="pointer menu-item"
                >
                  {route.name}
                </ListItem>
              ))}
            </List>
          </MobileNav>
        )}
      </Hidden>
      {children}
    </StyledHeader>
  );
}
