import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import svgLoader from "vite-svg-loader";

import path from "path";

// @: https://blog.csdn.net/qq_61402485/article/details/131619797
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    build: {
        outDir: "static",
    },
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
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve(__dirname, "./src"),
            },
        ],
    },
});
