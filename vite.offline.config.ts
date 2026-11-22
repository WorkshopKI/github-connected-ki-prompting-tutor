import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/* Offline-Bau von „KI erklärt“: ein Bundle ohne Code-Splitting,
 * wird von scripts/build-offline.mjs zu einzelnen HTML-Dateien zusammengefügt. */
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    outDir: "dist-offline/build",
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: path.resolve(__dirname, "offline/erklaert.html"),
      output: { inlineDynamicImports: true },
    },
  },
});
