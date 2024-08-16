import React from "react";
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import HomePage from "./pages/HomePage";
import App from "./App";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import { Docs, Lists } from "@/components";
import useProfileStore from "./store/profileStore";

const RouterSetup: React.FC = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const { profile } = useProfileStore();

  const router = isSmallScreen
    ? createBrowserRouter(
        // Small screen
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="/lists/:listId" element={<Docs theme={profile.theme} />} />
            <Route path="/list" element={<Lists theme={profile.theme} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/password-recovery"
              element={<PasswordRecoveryPage />}
            />
          </Route>
        )
      )
    : createBrowserRouter(
        // Large screen
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/password-recovery"
              element={<PasswordRecoveryPage />}
            />
            <Route path="/list" element={<HomePage />} />
            <Route path="/lists/:listId" element={<HomePage />} />
            <Route path="/doc" element={<HomePage />} />
          </Route>
        )
      );

  return <RouterProvider router={router} />;
};

export default RouterSetup;
