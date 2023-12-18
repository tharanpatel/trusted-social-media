// Lamadev (2022) React Social Media App design, Source code, https://github.com/safak/youtube2022/tree/react-social-ui

import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext.js";
import Navbar from "./components/navbar/Navbar.jsx";
import RightBar from "./components/rightBar/RightBar.jsx";
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import LeftBar from "./components/leftBar/LeftBar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeContext } from "./contexts/darkModeContext.js";
import "./style.scss";

function App() {

  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  /* allows us fetch data from a server
    a query can be in 3 states seen below
    isLoading - The query has no data yet
    isError - The query encountered an error (the error is available using the 'error' property)
    isSuccess - The query was successful and data is available (data is available using the 'data' property)
  */
  const queryClient = new QueryClient();


  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`} >
        <QueryClientProvider client={queryClient}>
          <div>
            <Navbar />
            <div style={{ display: "flex" }}>
              <LeftBar />
              <div style={{ flex: 8, maxWidth: "900px" }}>
                <Outlet /> {/* this will either be the homepage feed or the profile page depending where the user is */}
              </div>
              <RightBar />
            </div>
          </div>
        </QueryClientProvider>
      </div>
    )
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {  // if user is not logged in
      return <Navigate to="/login" />;
    }

    return children;
  };

  /* Controls the routing for all pages within the application. 
     The children property is used so that the Navbar and RightBar components can provide a fixed layout
     for other content to be implemented into the middle section.
  */
  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ])

  return (

    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
