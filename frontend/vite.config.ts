import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      // Generate the manifest file on build
      manifest: {
        name: "doorways",
        short_name: "doorways",
        description: "Easy access control for educational institutions",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "/doorways-logo-app.png",
            sizes: "250x250",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        background_color: "#e17100", // closest to amber-600 in tailwindcss
        theme_color: "#e17100",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
