import { createRouter, createWebHashHistory } from "vue-router";

var routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/",
        redirect: "control",
        component: () => import("../views/Main.vue"),

        children: [
            {
                path: "control",
                name: "control",
                component: () => import("../views/sub/Control.vue"),
            },
            {
                path: "interact",
                name: "interact",
                component: () => import("../views/sub/Interact.vue"),
            },
            {
                path: "config",
                name: "config",
                component: () => import("../views/sub/Config.vue"),
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

// router.beforeEach((to, _from, next) => {
//     next();
// });

export default router;
