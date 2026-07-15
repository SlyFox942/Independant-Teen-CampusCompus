import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "~/App";
import "~/styles/app.css";
import { registerServiceWorker, setupInstallPrompt } from "~/utils/pwa";

// Register service worker for offline support
registerServiceWorker();

// Set up PWA install prompt listener
setupInstallPrompt();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);