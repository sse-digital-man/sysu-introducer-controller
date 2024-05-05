import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "./styles/element/index.scss";

import router from "./router";

const app = createApp(App);
app.use(ElementPlus).use(router).mount("#app");
