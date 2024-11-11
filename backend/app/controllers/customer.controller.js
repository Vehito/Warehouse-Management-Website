const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CustomerService = require("../services/customer.service")

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const customerService = new CustomerService(MongoDB.client);
        const customers = await customerService.findByName(req.body?.name);
        if(customers.length > 0){
            return next(new ApiError(409, "Customer existed"));
        }
        const document = await customerService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the customer")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const customerService = new CustomerService(MongoDB.client);
        const { name } = req.query;
        if(name) {
            documents = await customerService.findByName(name);
        }
        else {
            documents = await customerService.find({});
        };
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving customers"));
    };

    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Customer not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving customer with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty!"));
    };
    try {
        const customerService = new CustomerService(MongoDB.client);
        const customers = await customerService.findByName(req.body.name);
        if(customers.length > 1) {
            return next(new ApiError(409, "Conflict customer name"));
        }
        const document = await customerService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Customer not found!"));
        }
        return res.send({ message: "Customer was updated successfully" });
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Error updating contact with id=${req.params.id}`
            )
        ); 
    }
};

exports.delete = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Customer not found!"));
        }
        return res.send({ message: "Customer was deleted successfully" });
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete customer with id=${req.params.id}`
            )
        );
    };
};
