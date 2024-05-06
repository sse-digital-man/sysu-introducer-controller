import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    server: {
        port: 8080,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8082",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
