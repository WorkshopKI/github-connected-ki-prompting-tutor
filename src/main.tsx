import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { initErrorCapture } from "@/lib/actionTracker";

initErrorCapture();

// Ein helles Theme aus dem Design-System (Werte in :root, src/index.css).
// Die früheren Presets (Stone, Moss, Silber, …-dark) werden auf "light" umgestellt.
// .dark ist in index.css definiert und kann später wieder freigeschaltet werden.
const THEMES = ["light"];
try {
  const stored = localStorage.getItem("theme");
  if (stored && !THEMES.includes(stored)) localStorage.setItem("theme", "light");
} catch {
  /* localStorage nicht verfügbar */
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    themes={THEMES}
  >
    <App />
  </ThemeProvider>
);
