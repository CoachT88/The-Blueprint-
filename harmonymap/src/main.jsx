import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HarmonyMap from "./HarmonyMap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HarmonyMap />
  </StrictMode>
);
