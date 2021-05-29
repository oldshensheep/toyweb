import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        component: () => import("./components/index"),
    },
    {
        path: "/result",
        name: "result",
        component: () => import("./components/result"),
        props: true,
    },
    {
        path: "/about",
        component: () => import("./components/about"),
    },
    {
        path: "/setting",
        component: () => import("./components/setting"),
    },
];
const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});
export default router;
