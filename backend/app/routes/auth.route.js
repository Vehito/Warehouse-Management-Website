const express = require("express");
const employee = require("../controllers/employee.controller");

const router = express.Router();

router.route("/login")
    .post(employee.login);

router.route("/logout")
    .post(employee.logout);

module.exports = router;