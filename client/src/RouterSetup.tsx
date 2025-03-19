import React, { useState, useEffect } from "react";
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import App from "./App";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Links, Notifications } from "@/components";
import NotFound from "@/pages/NotFound";
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";
import AppLayout from "./layouts/AppLayout";
import CreateUserForm from "./components/Forms/CreateUserForm";

const RouterSetup: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 1024px)").matches);
    };
    updateScreenSize(); // Check on mount
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        {/* Auth Routes (Public) - Outside AppLayout */}
        <Route path="/auth/signin" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/createuser" element={<CreateUserForm />} />

        {/* Secure Routes (Protected) - Wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Conditional Small & Large Screen Handling */}
          {isSmallScreen ? (
            <>
              <Route path="/c/:collectionId" element={<Links />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/c/:collectionId?" element={<DashboardPage />} />
            </>
          )}

          {/* Catch-all for Protected Routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RouterSetup;
