import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { getAuthToken } from "./auth";

function RequireAuth() {
  return getAuthToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "*", element: <Navigate to="/" replace /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: "/admin",
  },
);
