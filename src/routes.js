import Admin from "./pages/Admin";
import Employees from "./pages/Employees";

const routes = [
  {
    path: "/admin",
    name: "Admin",
    component: Admin
  },
  {
    path: "/",
    name: "Employees",
    component: Employees
  }
];

export default routes;
