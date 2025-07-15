import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  base: "/Clinexa-Client/",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      maxParallelFileOps: 2,
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          kendo: [
            "@progress/kendo-react-grid",
            "@progress/kendo-react-buttons",
          ],
        },
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    exclude: ["@progress/kendo-licensing"],
  },
});
