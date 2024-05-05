import { createRouter, createWebHistory } from "vue-router";

var routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// router.beforeEach((to, _from, next) => {
//     next();
// });

export default router;
