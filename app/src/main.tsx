import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import Yams from "./pages/Yams.tsx";
import { AuthLayout } from "./components/AuthLayout.tsx";
import { Layout } from "./components/Layout.tsx";
import ConnexionPage from "./pages/ConnexionPage.tsx";
import InscriptionPage from "./pages/InscriptionPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout should_be_auth={true} />,
    children: [
      {
        path: "/yams",
        element: <Yams />,
      },
      {
        path: "/results",
        element: <ResultsPage />,
      },
    ],
  },
  {
    element: <AuthLayout should_be_auth={false} />,
    children: [
      {
        path: "/connexion",
        element: <ConnexionPage />,
      },
      {
        path: "/inscription",
        element: <InscriptionPage />,
      },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
