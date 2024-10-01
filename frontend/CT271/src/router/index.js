import { createWebHistory, createRouter } from "vue-router";
import Products from "@/views/Products.vue";

const routes = [
    {
        path: "/",
        name: "products",
        component: Products,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;