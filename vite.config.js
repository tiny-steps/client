import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://194.164.150.134:8080",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxy request:", req.method, req.url);
            console.log("Request cookies:", req.headers.cookie);
            // Keep original cookies instead of overriding origin
            if (req.headers.cookie) {
              proxyReq.setHeader("Cookie", req.headers.cookie);
            }
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("Proxy response:", proxyRes.statusCode, req.url);
            console.log("Response headers:", proxyRes.headers);

            // Fix Set-Cookie headers for local development
            // if (proxyRes.headers["set-cookie"]) {
            //   proxyRes.headers["set-cookie"] = proxyRes.headers[
            //     "set-cookie"
            //   ].map((cookie) => {
            //     // Remove Secure flag for local development (HTTP)
            //     return cookie.replace(/;\s*Secure/gi, "");
            //   });
            //   console.log("Modified cookies:", proxyRes.headers["set-cookie"]);
            // }

            // Add CORS headers to the response
            // proxyRes.headers["access-control-allow-origin"] =
            //   "http://localhost:5174";
            // proxyRes.headers["access-control-allow-credentials"] = "true";
            // proxyRes.headers["access-control-allow-methods"] =
            //   "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS";
            // proxyRes.headers["access-control-allow-headers"] =
            //   "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie";
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
