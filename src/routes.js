import Admin from "./pages/Admin";
import Employees from "./pages/Employees";

const routes = [
  {
    path: "/employee-directory/admin",
    name: "Admin",
    component: Admin
  },
  {
    path: "/employee-directory",
    name: "Employees",
    component: Employees
  }
];

export default routes;
