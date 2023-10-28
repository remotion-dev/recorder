import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { DevicePermission } from "./DevicePermission";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <DevicePermission>
        <App />
      </DevicePermission>
    </ThemeProvider>
  </React.StrictMode>,
);
