import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      includeAssets: ["icon.svg"],
      manifest: {
        name: "هواشناسی زنده - Live Weather",
        short_name: "Weather",
        description: "پیش‌بینی هوای زنده با پس‌زمینه‌ی سینمایی",
        theme_color: "#1a1f2e",
        background_color: "#1a1f2e",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "weather-api-cache",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 30 },
            },
          },
          {
            urlPattern:
              /^https:\/\/.*\.(wikipedia\.org|tile\.openstreetmap\.org)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "external-assets-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
});
