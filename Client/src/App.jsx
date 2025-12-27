import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SendApplication from "./pages/SendApplication";
import Profile from "./pages/Profile";
import History from "./pages/History";
import FetchCurrentUser from "./fetchUserdata/FetchCurrentUser";

const App = () => {
  const { userdata, Loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(FetchCurrentUser());
  }, []);

  if (Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },

    {
      path: "/login",
      element: userdata ? <Navigate to="/" replace /> : <Login />,
    },

    {
      path: "/signup",
      element: userdata ? <Navigate to="/" replace /> : <Signup />,
    },

    {
      path: "/send",
      element: userdata ? <SendApplication /> : <Navigate to="/login" replace />,
    },

    {
      path: "/profile",
      element: userdata ? <Profile /> : <Navigate to="/login" replace />,
    },

    {
      path: "/history",
      element: userdata ? <History /> : <Navigate to="/login" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
