import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

// Create a new router instance
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
