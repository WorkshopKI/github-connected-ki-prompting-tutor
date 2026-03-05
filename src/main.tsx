import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="muted-stone"
    enableSystem={false}
    themes={[
      "muted-stone", "muted-stone-soft", "muted-stone-contrast",
      "muted-moss", "muted-moss-light", "muted-moss-rich",
      "elegant-serif", "elegant-serif-warm", "elegant-serif-noir",
      "orange-muted"
    ]}
  >
    <App />
  </ThemeProvider>
);
