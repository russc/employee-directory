import gql from "graphql-tag";

export const GET_EMPLOYEES = gql`
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

export const ADD_EMPLOYEE = gql`
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
/* Technically we should be able touse the same mutation from ADD_EMPLOYEE 
and just omit the id variable; however, there is a bug in GraphQL Engine (hasura)
 where id is expected to be non-null no matter what you set the variable to.  So
 the solution for this edge case is to be a little less DRY until an upcoming
 release is available to fix.
*/
export const UPDATE_EMPLOYEE = gql`
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

export const DEPARTMENTS = gql`
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

export const ADD_DEPARTMENT = gql`
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

export const ADD_POSITION = gql`
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
