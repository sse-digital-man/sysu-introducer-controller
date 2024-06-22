import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "./styles/element/index.scss";

import router from "./router";
import store from "./store";

import vue3TreeOrg from "vue3-tree-org";
import "vue3-tree-org/lib/vue3-tree-org.css";

const app = createApp(App);
app.use(ElementPlus).use(router).use(store).use(vue3TreeOrg).mount("#app");
