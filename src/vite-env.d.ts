/// <reference types="vite/client" />

// https://stackoverflow.com/questions/54839057/vscode-showing-cannot-find-module-ts-error-for-vue-import-while-compiling-doe
declare module "*.vue";

declare interface Window {
    ws: WebSocket;
}
