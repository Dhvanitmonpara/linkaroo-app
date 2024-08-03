import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* FIXME: fix this repeatation */}
      <Route path="/" element={<App />} />
      <Route path="/list" element={<App />} />
      <Route path="/doc" element={<App />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
