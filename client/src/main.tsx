import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { init as initFullStory } from "@fullstory/browser";

if (import.meta.env.VITE_FULLSTORY_ORG_ID) {
  initFullStory({
    orgId: import.meta.env.VITE_FULLSTORY_ORG_ID,
    devMode: import.meta.env.VITE_NODE_ENV === "development",
  });
} else {
  console.log("FullStory not enabled");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
