import { createWebHistory, createRouter } from "vue-router";
import ImportShipments from "@/views/ImportShipment/ImportShipments.vue";
import Customers from "@/views/Customer/Customers.vue";

const routes = [
    {
        path: "/",
        name: "product",
        component: () => import("@/views/Product/Products.vue"),
    },

    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },

    {
        path: "/product/:id",
        name: "product.edit",
        component: () => import("@/views/Product/ProductEdit.vue"),
        params: true
    },

    {
        path: "/products",
        name: "product.create",
        component: () => import("@/views/Product/ProductCreate.vue")
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
    },

    {
        path: "/customer",
        name: "customer",
        component: Customers
    },

    {
        path: "/customer/:id",
        name: "customer.edit",
        component: () => import("@/views/Customer/CustomerEdit.vue"),
        params: true
    },

    {
        path: "/create-customer",
        name: "customer.create",
        component: () => import("@/views/Customer/CustomerCreate.vue")
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;