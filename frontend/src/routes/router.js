import { createBrowserRouter } from "react-router-dom";
import { RoleRoute } from "./RoleRoute";
import ProtectedRoute from "./ProtectedRoute";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import Contactus from "../pages/Contactus";
import SuperAdminLayout from "../layouts/Superadmin";
import AdminLayout from "../layouts/admin";
import TeamMember from "../pages/SuperAdmin";
import AdminMember from "../pages/AdminMember";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "contact-us", element: <Contactus /> },
     
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allowedRoles={["superadmin"]} />,
            children: [
              {
                path: "superadmin",
                element: <SuperAdminLayout />,
                children: [
                  { index: true, element: <TeamMember /> },
                  {
                    path: "profile",
                    element: <Profile />
                  }
                ],
              },
            ],
           
          },

          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "admin",
                element: <AdminLayout />,
                children: [
                  { index: true, element: <AdminMember /> },
                  {
                    path: "profile",
                    element: <Profile />
                  }
                ],
              },
            ],
           
          },
        ],
      },
    ],
  },
]);