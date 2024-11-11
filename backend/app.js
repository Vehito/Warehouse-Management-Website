const express = require("express");
const cors = require("cors");
const routers = require("./app/routes/index.route")
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", routers.product);
app.use("/api/importShipments", routers.importShipment);
app.use("/api/customers", routers.customer);

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

//handler 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found!!!"));
});

app.use((err, req, res, next) => {
    //Middleware xu ly loi tap trung
    //Trong cac doan code xu ly o cac route, goi next(error) se chuyen ve middleware xu ly loi nay
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;