import { createBrowserRouter } from "react-router-dom";

import Home from "./page/home";
import Login from "./page/login";
import Register from "./page/register";
import CarDetail from "./page/car";
import Dashboard from "./page/dashboard";
import New from "./page/dashboard/new";
import Layout from "./components/layout";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      {
        path: "/dashboard/new",
        element: <New/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

export { router };