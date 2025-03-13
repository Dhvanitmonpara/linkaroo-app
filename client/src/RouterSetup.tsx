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
import { Links, Notifications } from "@/components";
import NotFound from "@/pages/NotFound"; // Import your NotFound component
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";
import AppLayout from "./layouts/AppLayout";
import CreateUserForm from "./components/Forms/CreateUserForm";

const RouterSetup: React.FC = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const router = isSmallScreen
    ? createBrowserRouter(
      // Small screen
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route path="" element={<HomePage />} />
          <Route path="/collections/:collectionId" element={<Links />} />
          <Route path="/collections/:collectionId/links/:docId" element={<Links />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      )
    )
    : createBrowserRouter(
      // Large screen
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route path="/auth/signin" element={<LoginPage />} />
          <Route path="/auth/createuser" element={<CreateUserForm />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/" element={<AppLayout />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/dashboard/c" element={<DashboardPage />} />
            <Route path="/dashboard/c/:collectionId" element={<DashboardPage />} />
            <Route path="/dashboard/c/:collectionId/links/:docId" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      )
    );

  return <RouterProvider router={router} />;
};

export default RouterSetup;
