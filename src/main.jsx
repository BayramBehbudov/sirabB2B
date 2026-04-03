import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainProvider from "./providers/MainProvider.jsx";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./i18n";

fetch("/config.json")
  .then((res) => res.json())
  .then((config) => {
    if (config.companyName) {
      document.title = config.companyName;
    } else {
      document.title = "Tinda";
    }
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <MainProvider config={config} />
      </StrictMode>,
    );
  })
  .catch((error) => {
    document.title = "Tinda";
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <MainProvider config={{ companyName: "Tinda" }} />
      </StrictMode>,
    );
  });
