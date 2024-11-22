const express = require("express");
const exportShipment = require("../controllers/exportShipment.controller");

const router = express.Router();

router.route("/")
    .get(exportShipment.findAll)
    .post(exportShipment.create);

router.route("/:id")
    .get(exportShipment.findOne);

module.exports = router;