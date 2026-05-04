import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import PortalPage from "@/pages/public/PortalPage";
import SubmitPage from "@/pages/public/SubmitPage";
import SuccessPage from "@/pages/public/SuccessPage";
import PrivacyPage from "@/pages/public/PrivacyPage";

export const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/portal", element: <PortalPage /> },
        { path: "/submit", element: <SubmitPage /> },
        { path: "/success", element: <SuccessPage /> },
        { path: "/privacy", element: <PrivacyPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
