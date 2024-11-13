import { createRoot } from "react-dom/client";
import "./index.css";
import Render from "./Render.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Render />
    </BrowserRouter>
);
