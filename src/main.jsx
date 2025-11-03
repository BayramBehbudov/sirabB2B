import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainProvider from "./providers/MainProvider.jsx";
import 'primereact/resources/themes/saga-blue/theme.css';   
import 'primereact/resources/primereact.min.css';           
import 'primeicons/primeicons.css';                         
import './i18n'; 


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainProvider />
  </StrictMode>
);
