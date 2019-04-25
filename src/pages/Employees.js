import React, { Fragment, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import { FiMail, FiPhone, FiPlusCircle, FiEdit } from "react-icons/fi";
import Loader from "../components/Loader/Loader";
import {
  FaceCard,
  NameSection,
  StyledPaper,
  Avatar
} from "../components/StyledComponents/StyledComponents";
import Header from "../components/Header/Header";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";

const InfoSection = ({ dept, position }) => (
  <div>
    <p>{dept}</p>
    <p>{position}</p>
  </div>
);

const GET_EMPLOYEES = gql`
  query($limit: Int, $offset: Int, $search: String) {
    employees(
      where: { full_name: { _ilike: $search } }
      limit: $limit
      offset: $offset
      order_by: { last_name: asc }
    ) {
      id
      email
      gender
      first_name
      last_name
      full_name
      phone
      position
      positionByPosition {
        departmentByDepartment {
          name
        }
        title
      }
      pic_large
      pic_med
      pic_thumb
    }

    positions {
      id
      title
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $email: String!
    $first: String!
    $last: String!
    $full: String!
    $gender: String!
    $phone: String!
    $large: String!
    $med: String!
    $thumb: String!
    $position: Int!
  ) {
    insert_employees(
      objects: {
        email: $email
        first_name: $first
        full_name: $full
        gender: $gender
        last_name: $last
        phone: $phone
        pic_large: $large
        pic_med: $med
        pic_thumb: $thumb
        position: $position
      }
    ) {
      returning {
        id
        email
        gender
        first_name
        last_name
        full_name
        phone
        position
        positionByPosition {
          departmentByDepartment {
            name
          }
          title
        }
        pic_large
        pic_med
        pic_thumb
      }
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee(
    $id: Int!
    $email: String!
    $first: String!
    $last: String!
    $full: String!
    $gender: String!
    $phone: String!
    $large: String!
    $med: String!
    $thumb: String!
    $position: Int!
  ) {
    insert_employees(
      objects: {
        id: $id
        email: $email
        first_name: $first
        full_name: $full
        gender: $gender
        last_name: $last
        phone: $phone
        pic_large: $large
        pic_med: $med
        pic_thumb: $thumb
        position: $position
      }
      on_conflict: {
        constraint: employees_pkey
        update_columns: [
          email
          first_name
          full_name
          gender
          phone
          last_name
          pic_large
          pic_med
          pic_thumb
          position
        ]
      }
    ) {
      returning {
        id
        email
        gender
        first_name
        last_name
        full_name
        phone
        position
        positionByPosition {
          departmentByDepartment {
            name
          }
          title
        }
        pic_large
        pic_med
        pic_thumb
      }
    }
  }
`;

export default function Employees({ client }) {
  const [employeeList, setEmployeeList] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("Add");
  const [id, setId] = useState(null);
  const [index, setIndex] = useState("");
  const [offset, setOffset] = useState(0);
  const [topLoader, setTopLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const fetchData = async (searching = false) => {
    let {
      data: { employees },
      data: { positions },
      loading
    } = await client.query({
      query: GET_EMPLOYEES,
      variables: {
        limit: searching === true ? null : 12,
        offset: searching === true ? 0 : offset,
        search: searching === true ? `%${search}%` : null
      }
    });
    setPositions(positions);
    setTopLoader(loading);
    setBottomLoader(loading);
    let employeeArray =
      searching === true ? [...employees] : [...employeeList, ...employees];

    setEmployeeList(employeeArray);

    if (searching === false) {
      setOffset(offset + 12);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearSearch = e => {
    setSearch("");
    document.getElementById("searchField").value = "";
    fetchData();
  };
  const handleSearch = e => {
    e.preventDefault();
    fetchData(true);
  };

  const handleScroll = e => {
    if (search.length === 0) {
      const scrolled = e.target.scrollHeight - e.target.scrollTop;
      const height = e.target.clientHeight;
      const bottom = scrolled === height;

      if (bottom) {
        setBottomLoader(true);
        fetchData();
      }
    }
  };

  if (topLoader) return <Loader amount={9} />;

  return (
    <Fragment>
      <Header>
        <form onSubmit={handleSearch} className="search-bar">
          <Tooltip title="Add Employee" placement="left-start">
            <IconButton
              aria-label="Add Employee"
              onClick={() => {
                setDialog(true);
              }}
            >
              <FiPlusCircle size="30" />
            </IconButton>
          </Tooltip>
          <TextField
            id="searchField"
            variant="outlined"
            InputProps={{
              startAdornment: search.length ? (
                <InputAdornment position="start">
                  <Tooltip title="Clear search">
                    <CloseIcon
                      className="pointer"
                      onClick={() => clearSearch()}
                    />
                  </Tooltip>
                </InputAdornment>
              ) : (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            defaultValue={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button type="submit" disabled={!search.length}>
            Search
          </Button>
        </form>
      </Header>
      <StyledPaper elevation={0}>
        <Grid
          container
          spacing={24}
          style={{ height: "80vh", overflowY: "scroll" }}
          onScroll={handleScroll}
        >
          {employeeList.length === 0 ? (
            <Fade in timeout={{ enter: 100, exit: 700 }}>
              <h1>No results</h1>
            </Fade>
          ) : (
            employeeList.map((employee, index) => (
              <Fade in key={index} timeout={{ enter: 100, exit: 700 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <FaceCard className={employee.updated && "updated"}>
                    <NameSection>
                      <p>{`${employee.first_name} ${employee.last_name} `}</p>
                      <div>
                        <a href={`tel:${employee.phone}`}>
                          <FiPhone color="#fff" size="20px" />
                        </a>
                        <a href={`mailto:${employee.email}`}>
                          <FiMail color="#fff" size="20px" />
                        </a>
                      </div>
                    </NameSection>
                    <Avatar src={employee.pic_large} alt={employee.email} />

                    <InfoSection
                      dept={
                        employee.positionByPosition.departmentByDepartment.name
                      }
                      position={employee.positionByPosition.title}
                    />
                    <Tooltip title="Edit Employee" placement="left-start">
                      <IconButton
                        aria-label="Edit Employee"
                        onClick={() => {
                          setId(employee.id);
                          setIndex(index);
                          setEmail(employee.email);
                          setFirst(employee.first_name);
                          setLast(employee.last_name);
                          setGender(employee.gender);
                          setPhone(employee.phone);
                          setPhoto(employee.pic_large);
                          setSelected(employee.position);
                          setMode("Edit");
                          setDialog(true);
                        }}
                      >
                        <FiEdit color="353131" size="20px" />
                      </IconButton>
                    </Tooltip>
                  </FaceCard>
                </Grid>
              </Fade>
            ))
          )}
          {bottomLoader && <Loader amount={5} bottom />}
        </Grid>
        <Dialog
          open={dialog}
          // onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add a Employee</DialogTitle>

          <Mutation
            mutation={mode === "Add" ? ADD_EMPLOYEE : UPDATE_EMPLOYEE}
            update={(
              cache,
              {
                data: {
                  insert_employees: { returning }
                }
              }
            ) => {
              let updated = [...employeeList];
              if (index !== "") {
                updated[index] = { ...returning[0], updated: true };
                setEmployeeList(updated);
              } else {
                setEmployeeList([{ ...returning[0], updated: true }]);
                setTimeout(() => {
                  setEmployeeList([returning[0], ...employeeList]);
                }, 3000);
              }
              setDialog(false);
              setId("");
              setIndex("");
              setEmail("");
              setFirst("");
              setLast("");
              setGender("");
              setPhone("");
              setPhoto("");
              setSelected("");
              setMode("Add");
            }}
          >
            {add => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const alwaysUse = {
                      email,
                      first,
                      last,
                      full: `${first} ${last}`,
                      gender,
                      phone,
                      large: photo,
                      med: photo,
                      thumb: photo,
                      position: selected
                    };
                    const variables =
                      mode === "Add" ? { ...alwaysUse } : { id, ...alwaysUse };
                    add({
                      variables
                    });
                  }}
                >
                  <DialogContent>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="email"
                          label="Email"
                          type="email"
                          fullWidth
                          defaultValue={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="first"
                          label="First Name"
                          type="text"
                          fullWidth
                          defaultValue={first}
                          onChange={e => setFirst(e.target.value)}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="last"
                          label="Last Name"
                          type="text"
                          fullWidth
                          defaultValue={last}
                          onChange={e => setLast(e.target.value)}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="gender"
                          label="Gender"
                          type="text"
                          fullWidth
                          defaultValue={gender}
                          onChange={e => setGender(e.target.value)}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="phone"
                          label="Phone"
                          type="text"
                          fullWidth
                          defaultValue={phone}
                          onChange={e => setPhone(e.target.value)}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="pic"
                          label="Photo URL"
                          type="text"
                          fullWidth
                          defaultValue={photo}
                          onChange={e => setPhoto(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="position"
                          select
                          fullWidth
                          label="Select"
                          value={selected}
                          onChange={e => setSelected(e.target.value)}
                          helperText="Select position"
                          margin="normal"
                        >
                          {positions.map(pos => (
                            <MenuItem key={pos.id} value={pos.id}>
                              {pos.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button type="submit" color="primary">
                      {mode} Employee
                    </Button>
                    <Button onClick={() => setDialog(false)} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </form>
              </div>
            )}
          </Mutation>
        </Dialog>
      </StyledPaper>
    </Fragment>
  );
}
