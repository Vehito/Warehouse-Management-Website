const ImportShipmentService = require("../services/importShipment.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");

exports.create = async (req, res, next) => {
    let products = [];
    for (const item of req.body.products) {
        if(!item["productId"])
            return next(new ApiError(400, "Product can not be empty!"));
        else {
            products.push({productId: item["productId"], quantity: item["quantity"]});
        }
    }


    try {
        const importShipmentService = new ImportShipmentService(MongoDB.client);
        const productService = new ProductService(MongoDB.client);

        const productIds = products.map(p => p.productId);
        const existingProducts = await productService.findByIds(productIds);

        if(existingProducts.length !== productIds.length) {
            return next(new ApiError(404, "One or more products not found"));
        }

        const document = await importShipmentService.create(req.body);

        // increase quantity in Products
        if(document){
            await Promise.all(products.map(product => {
                productService.increaseQuantity(product.productId, product.quantity);
            }));
        }
        return res.send(document);
    }
    catch (error) {
        if(error.statusCode === 404) {
            return next(
                new ApiError(404, `${error.message}`)
            )
        }
        return next(
            new ApiError(500, "An error occurred while creating the import shipment")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const importShipmentService = new ImportShipmentService(MongoDB.client);
        const document = await importShipmentService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Import shipment not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving import shipment"));
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const importShipmentService = new ImportShipmentService(MongoDB.client);
        const { date } = req.query;
        if(date) {
            documents = await importShipmentService.findByDate(date);
        }
        else {
            documents = await importShipmentService.find({});
        }
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving import shipments"))
    }

    return res.send(documents);
}