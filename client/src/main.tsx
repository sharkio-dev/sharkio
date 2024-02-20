import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { init as initFullStory } from "@fullstory/browser";

// @ts-ignore
if (window._env_.VITE_FULLSTORY_ORG_ID) {
  initFullStory({
    // @ts-ignore
    orgId: window._env_.VITE_FULLSTORY_ORG_ID,
    // @ts-ignore
    devMode: window._env_.VITE_NODE_ENV !== "production",
  });
} else {
  console.log("FullStory not enabled");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
