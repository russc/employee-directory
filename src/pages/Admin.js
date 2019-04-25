import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Fade from "@material-ui/core/Fade";
import Header from "../components/Header/Header";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FiPlusCircle } from "react-icons/fi";
import Notify from "../components/Notify/Notify";
import { StyledPaper } from "../components/StyledComponents/StyledComponents";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const DEPARTMENTS = gql`
  query getDepartments {
    departments {
      id
      name
      positions {
        id
        title
      }
    }
  }
`;

const ADD_DEPARTMENT = gql`
  mutation($name: String!) {
    insert_departments(objects: { name: $name }) {
      returning {
        id
        name
        positions {
          id
          title
        }
      }
    }
  }
`;

const ADD_POSITION = gql`
  mutation($dept: Int!, $title: String!) {
    insert_positions(objects: { department: $dept, title: $title }) {
      returning {
        id
        department
        title
      }
    }
  }
`;

export default function Admin() {
  const [text, setText] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [dialog, setDialog] = useState({ open: false, type: "" });
  const [notify, setNotify] = useState({ open: false, message: "" });

  return (
    <>
      <Header />
      <StyledPaper elevation={0}>
        <Fade in timeout={{ enter: 700, exit: 700 }}>
          <Grid
            container
            spacing={8}
            style={{ height: "90vh", overflowY: "scroll" }}
          >
            <Grid item xs={12}>
              <h1>
                Departments
                <Tooltip title="Add Department">
                  <IconButton
                    aria-label="Add Department"
                    onClick={() => setDialog({ open: true, type: "dept" })}
                  >
                    <FiPlusCircle size="30" />
                  </IconButton>
                </Tooltip>
              </h1>
            </Grid>
            <Query query={DEPARTMENTS}>
              {({ data: { departments }, loading, error }) => {
                if (loading) return "loading...";
                if (error) return error;
                return departments.map(dept => (
                  <Grid item xs={12} md={6} lg={4} key={dept.id}>
                    <List>
                      <h2>
                        {dept.name}
                        <Tooltip
                          title={`Add position to ${dept.name}`}
                          placement="right-end"
                        >
                          <IconButton
                            aria-label={`Add position to ${dept.name}`}
                            onClick={() => {
                              setDialog({
                                open: true,
                                type: "pos"
                              });
                              setDepartmentID(dept.id);
                            }}
                          >
                            <FiPlusCircle size="30" />
                          </IconButton>
                        </Tooltip>
                      </h2>

                      {dept.positions.length > 0 &&
                        dept.positions.map(position => (
                          <ListItem key={position.id}>
                            {position.title}
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                ));
              }}
            </Query>
          </Grid>
        </Fade>
        <Dialog open={dialog.open} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Add a {dialog.type === "dept" ? "Department" : "Position"}
          </DialogTitle>

          <Mutation
            mutation={dialog.type === "dept" ? ADD_DEPARTMENT : ADD_POSITION}
            update={
              dialog.type === "dept"
                ? (
                    cache,
                    {
                      data: {
                        insert_departments: { returning }
                      }
                    }
                  ) => {
                    const { departments } = cache.readQuery({
                      query: DEPARTMENTS
                    });
                    cache.writeQuery({
                      query: DEPARTMENTS,
                      data: { departments: [...departments, ...returning] }
                    });
                    setDialog({
                      open: false,
                      type: ""
                    });
                    setNotify({
                      open: true,
                      message: `${text} has been created!`
                    });
                  }
                : (
                    cache,
                    {
                      data: {
                        insert_positions: { returning }
                      }
                    }
                  ) => {
                    const { departments } = cache.readQuery({
                      query: DEPARTMENTS
                    });
                    let updated = departments;
                    const index = updated.findIndex(
                      dept => dept.id === returning[0].department
                    );
                    const { id, title } = returning[0];
                    updated[index].positions.push({
                      id,
                      title,
                      __typename: "positions"
                    });
                    console.log(updated);
                    cache.writeQuery({
                      query: DEPARTMENTS,
                      data: { departments: [...updated] }
                    });
                    setDialog({
                      open: false,
                      type: ""
                    });
                  }
            }
          >
            {add => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (dialog.type === "dept") {
                      add({ variables: { name: text } });
                    } else {
                      add({
                        variables: {
                          title: text,
                          dept: departmentID
                        }
                      });
                      setNotify({
                        open: true,
                        message: `${text} has been created!`
                      });
                    }
                    setDepartmentID("");
                    setText("");
                  }}
                >
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id={dialog.type === "dept" ? "department" : "position"}
                      label={
                        dialog.type === "dept"
                          ? "New Department"
                          : "New Position"
                      }
                      type="text"
                      fullWidth
                      defaultValue={text}
                      onChange={e => setText(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button type="submit" color="primary">
                      Add {dialog.type === "dept" ? "Department" : "Position"}
                    </Button>
                    <Button
                      onClick={() => setDialog({ open: false, type: "" })}
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </form>
              </div>
            )}
          </Mutation>
        </Dialog>
        <Notify open={notify.open} message={notify.message} />
      </StyledPaper>
    </>
  );
}
