import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { SettingsProvider } from "./context/SettingsProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //  <React.StrictMode> Remove for production
  <BrowserRouter>
    <AuthProvider>
      <SettingsProvider>
      <App />
      </SettingsProvider>
    </AuthProvider>
  </BrowserRouter>
  //  </React.StrictMode>
);
