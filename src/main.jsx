// React entry point.
import React from "react";
import ReactDOM from "react-dom/client";
// Global styles first, so feature stylesheets loaded by the pages can override them.
import "./styles/global.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
