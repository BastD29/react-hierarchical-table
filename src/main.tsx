import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./style/index.css";

// * AG GRID

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "ag-grid-enterprise";
// import { LicenseManager } from "ag-grid-enterprise";

// LicenseManager.setLicenseKey("AG Grid Enterprise");

// * SYNCFUSION

import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1NpTHxbf1x0ZFxMY1pbRHVPMyBoS35RckRjWX1eeXdTRmNUV0F+" // 7 days trial license key
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
