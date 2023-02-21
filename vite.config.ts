import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "http://this-coffee.net/",
  server: {
    host: true,
    proxy: {
      "^/api/.*": {
        // target: "http://localhost:3000",
        //本番環境(s3)では下のproxyが動かずaxiosの部分を書き換えないと動かなかった
        target: "http://35.79.178.52",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
