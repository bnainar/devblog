import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
// import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_API_BASEURL;
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// reportWebVitals(console.table);
