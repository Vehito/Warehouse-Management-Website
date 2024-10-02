import { createWebHistory, createRouter } from "vue-router";
import Products from "@/views/Products.vue";

const routes = [
    {
        path: "/",
        name: "products",
        component: Products,
    },

    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },

    {
        path: "/products/:id",
        name: "product.edit",
        component: () => import("@/views/ProductEdit.vue"),
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;