const express = require("express");
const importShipment = require("../controllers/importShipment.controller");

const impRouter = express.Router();

impRouter.route("/")
    .get(importShipment.findAll)
    .post(importShipment.create);

impRouter.route("/:id")
    .get(importShipment.findOne);

module.exports = impRouter;