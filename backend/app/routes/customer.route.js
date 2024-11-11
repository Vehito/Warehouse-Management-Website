const express = require("express");
const customer = require("../controllers/customer.controller");

const impRouter = express.Router();

impRouter.route("/")
    .get(customer.findAll)
    .post(customer.create);

impRouter.route("/:id")
    .get(customer.findOne)
    .delete(customer.delete)
    .put(customer.update);

module.exports = impRouter;