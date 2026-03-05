import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="muted-stone-contrast"
    enableSystem={false}
    themes={[
      "muted-stone-contrast",
      "muted-moss-light",
      "silber",
    ]}
  >
    <App />
  </ThemeProvider>
);
