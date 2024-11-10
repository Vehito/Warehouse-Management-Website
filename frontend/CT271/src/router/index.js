import { createWebHistory, createRouter } from "vue-router";
import ImportShipments from "@/views/ImportShipment/ImportShipments.vue";
import { compile } from "vue";

const routes = [
    {
        path: "/",
        name: "products",
        component: () => import("@/views/Products.vue"),
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

    {
        path: "/products",
        name: "product.create",
        component: () => import("@/views/ProductCreate.vue")
    },
    
    {
        path: "/importShipments",
        name: "importShipment",
        component: ImportShipments,
    },

    {
        path: "/importShipments/:id",
        name: "importShipment.detail",
        component: () => import("@/views/ImportShipment/ImportShipmentDetails.vue")
    },

    {
        path: "/importShipment",
        name: "importShipment.create",
        component: () => import("@/views/ImportShipment/ImportShipmentCreate.vue")
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;