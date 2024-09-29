const express = require("express");
const products = require("../controllers/product.controller");

const prodRouter = express.Router();

prodRouter.route("/")
    .get(products.findAll)
    .post(products.create)
    .delete(products.deleteAll);

prodRouter.route("/:id")
    .get(products.findOne)
    .put(products.update)
    .delete(products.delete);

prodRouter.route("/:id/importShipments")
    .get(products.findImportShipments)

module.exports = prodRouter;