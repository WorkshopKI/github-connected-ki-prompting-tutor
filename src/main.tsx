import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="minimal-pure"
    enableSystem={false}
    themes={[
      "minimal-pure", "minimal-grid", "minimal-ink",
      "clean-soft", "clean-crisp", "clean-air",
      "muted-sand", "muted-stone", "muted-moss",
      "elegant-serif", "elegant-contrast", "elegant-noir"
    ]}
  >
    <App />
  </ThemeProvider>
);
