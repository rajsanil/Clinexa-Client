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
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    // Increase chunk size limit to reduce number of chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Reduce concurrent file processing
      maxParallelFileOps: 2,
      output: {
        // Split vendor chunks to reduce file processing load
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
  // Optimize development server
  server: {
    fs: {
      strict: false,
    },
  },
  // Add this to help with file watching limits
  optimizeDeps: {
    exclude: ["@progress/kendo-licensing"],
  },
});
