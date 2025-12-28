import React, { useEffect, Suspense, lazy, useMemo } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FetchCurrentUser from "./fetchUserdata/FetchCurrentUser";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const SendApplication = lazy(() => import("./pages/SendApplication"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected Route wrapper - uses hook to get current userdata
const ProtectedRoute = ({ children }) => {
  const { userdata } = useSelector((state) => state.user);
  return userdata ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper - uses hook to get current userdata
const PublicRoute = ({ children }) => {
  const { userdata } = useSelector((state) => state.user);
  return userdata ? <Navigate to="/" replace /> : children;
};

const App = () => {
  const { Loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(FetchCurrentUser());
  }, [dispatch]);

  const router = useMemo(() => createBrowserRouter([
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PublicRoute>
              <Login />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PublicRoute>
              <Signup />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "/send",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <SendApplication />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/history",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ]), []);

  if (Loading) {
    return <LoadingSpinner />;
  }

  return <RouterProvider router={router} />;
};

export default App;
