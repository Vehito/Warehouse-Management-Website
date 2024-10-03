const ImportShipmentService = require("../services/importShipment.service");
const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const products = await productService.findByName(req.body?.name);
        if(products.length > 0){
            return next(new ApiError(409, "Product existed"));
        }
        const document = await productService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        const { name } = req.query;
        if(name) {
            documents = await productService.findByName(name);
        }
        else {
            documents = await productService.find({});
        };
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving products"));
    };

    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving product with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty!"));
    };
    try {
        const productService = new ProductService(MongoDB.client);
        const products = await productService.findByName(req.body.name);
        if(products.length >= 1) {
            return next(new ApiError(409, "Conflict product name"));
        }
        const document = await productService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Product not found!"));
        }
        return res.send({ message: "Product was updated successfully" });
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
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Product not found!"));
        }
        return res.send({ message: "Product was deleted successfully" });
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete product with id=${req.params.id}`
            )
        );
    };
};

exports.deleteAll = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const deleteCount = await productService.deleteAll();
        return res.send({
            message: `${deleteCount} products were deleted successfully`
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while removing all products"
            )
        );
    }
};

exports.findImportShipments = async (req, res, next) => {
    let documents = [];
    try {
        const productService = new ProductService(MongoDB.client);
        const importShipmentService = new ImportShipmentService(MongoDB.client);
        const productId = req.params.id
        if(!productService.findById(productId)){
            return next(new ApiError(404, `Product with id=${productId} not found`));
        };
        documents = await importShipmentService.find({"products.productId": productId});
        if(documents.length === 0){
            return res.send({ message: `There is no import shipment contain product with id=${productId}` });
        }
    }
    catch (error) {
        return next(new ApiError(500, "An error while retrieving import shipments"));
    }
    return res.send(documents);
}