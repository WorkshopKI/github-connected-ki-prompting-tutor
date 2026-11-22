import { createRoot } from "react-dom/client";
import "../index.css";
import ErklaertOffline from "./ErklaertOffline";

/* Offline-Fassung von „KI erklärt“: eine HTML-Datei ohne Server, ohne Login, ohne Netz.
 * Gebaut mit `npm run build:offline` (vite.offline.config.ts + scripts/build-offline.mjs). */
createRoot(document.getElementById("root")!).render(<ErklaertOffline />);
