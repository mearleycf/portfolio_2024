import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@icons-pack/react-simple-icons";
import "react-syntax-highlighter";
import "react-syntax-highlighter/dist/esm/styles/prism";
import "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import "inter-ui/inter.css";
import React from "react";

const rootElement = document.getElementById("root");
const root = rootElement ? createRoot(rootElement) : createRoot(document.body);

window.addEventListener("error", function (event) {
  console.log("Global window error listener:", event);
});

if (root) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
