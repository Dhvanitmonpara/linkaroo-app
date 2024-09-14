import React from "react";
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import DashboardPage from "./pages/DashboardPage";
import App from "./App";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import { Docs, Lists, Notifications } from "@/components";
import NotFound from "@/pages/NotFound"; // Import your NotFound component
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";

const RouterSetup: React.FC = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const router = isSmallScreen
    ? createBrowserRouter(
      // Small screen
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route path="" element={<Lists />} />
          <Route path="/lists/:listId" element={<Docs />} />
          <Route path="/lists/:listId/docs/:docId" element={<Docs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/password-recovery"
            element={<PasswordRecoveryPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      )
    )
    : createBrowserRouter(
      // Large screen
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route path="" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route
            path="/password-recovery"
            element={<PasswordRecoveryPage />}
          />
          <Route path="/list" element={<DashboardPage />} />
          <Route path="/lists/:listId" element={<DashboardPage />} />
          <Route path="/lists/:listId/docs/:docId" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      )
    );

  return <RouterProvider router={router} />;
};

export default RouterSetup;
