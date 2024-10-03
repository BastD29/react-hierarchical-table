import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./style/index.css";

import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1NpTHxbf1x0ZFxMY1pbRHVPMyBoS35RckRjWX1eeXdTRmNUV0F+" // 7 days trial license key (ending 9th october 2024)
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
