import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: true,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@icons": `${path.resolve(__dirname, "./src/shared/icons")}`,
      "@images": `${path.resolve(__dirname, "./src/shared/assets/images")}`,
    },
  },
  server: {
    port: 5173, // Установил порт 3000
  },
});
