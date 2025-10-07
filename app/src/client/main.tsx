import "./index.css";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from "./Dashboard";
import Home from "./Home";
import Signin from "./Signin";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/orders', element: <Dashboard /> },
  { path: '/login', element: <Signin /> },

])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)