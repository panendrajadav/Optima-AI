import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/accessibility-fix.css";

createRoot(document.getElementById("root")).render(<App />);
