const express = require("express");
const employee = require("../controllers/employee.controller");

const Router = express.Router();

Router.route("/")
    .get(employee.findAll)
    .post(employee.create);

Router.route("/:id")
    .get(employee.findOne)
    .delete(employee.delete)
    .put(employee.update);

Router.route("/login")
    .post(employee.login);

Router.route("/logout")
    .post(employee.logout);

module.exports = Router;