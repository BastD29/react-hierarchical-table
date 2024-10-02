import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./style/index.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";

LicenseManager.setLicenseKey("AG Grid Enterprise");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
