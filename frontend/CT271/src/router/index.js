import { createWebHistory, createRouter } from "vue-router";
import ImportShipments from "@/views/ImportShipment/ImportShipments.vue";
import Customers from "@/views/Customer/Customers.vue";
import Employee from "@/views/Employee/Employee.vue";
import Login from "@/views/Login.vue";
import ExportShipment from "@/views/ExportShipment/ExportShipment.vue";

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
        path: "/exportShipments/:id",
        name: "exportShipment.detail",
        component: () => import("@/views/ExportShipment/ExportShipmentDetail.vue"),
        params: true
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

    {
        path: "/employee",
        name: "employee",
        component: Employee
    },

    {
        path: "/create-employee",
        name: "employee.create",
        component: () => import("@/views/Employee/EmployeeCreate.vue")
    },

    {
        path: "/employee/:id",
        name: "employee.edit",
        component: () => import("@/views/Employee/EmployeeEdit.vue"),
        params: true,
        props: true
    },

    {
        path: "/login",
        name: "login",
        component: Login
    },

    {
        path: "/export-shipment",
        name: "exportShipment",
        component: ExportShipment
    },

    {
        path: "/exportShipment",
        name: "exportShipment.create",
        component: () => import("@/views/ExportShipment/ExportShipmentCreate.vue")
    },

    {
        path: "/importShipments/:id",
        name: "importShipment.detail",
        component: () => import("@/views/ImportShipment/ImportShipmentDetails.vue")
    },

    {
        path: "/product-import/:id",
        name: "product.import",
        component: () => import("@/views/Product/ProductImport.vue"),
        params: true
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;