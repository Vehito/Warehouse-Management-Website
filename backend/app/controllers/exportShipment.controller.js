const ExportShipmentService = require("../services/exportShipment.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");
const ImportShipmentService = require("../services/importShipment.service");
const CustomerService = require("../services/customer.service")

exports.create = async (req, res, next) => {
    let products = [];
    for (const item of req.body.products) {
        if(!item["productId"])
            return next(new ApiError(400, "Product can not be empty!"));
        else {
            products.push({productId: item["productId"], quantity: item["quantity"], importShipmentId: item["importShipmentId"]});
        }
    }

    try {
        const exportShipmentService = new ExportShipmentService(MongoDB.client);
        const productService = new ProductService(MongoDB.client);
        const importShipmentService = new ImportShipmentService(MongoDB.client);

        const productIds = products.map(p => p.productId);
        const existingProducts = await productService.findByIds(productIds);

        if(existingProducts.length !== productIds.length) {
            return next(new ApiError(404, "One or more products not found"));
        }

        const document = await exportShipmentService.create(req.body);

        // decrease quantity in Products
        if(document){
            await Promise.all(products.map(async (product) => {
                await productService.decreaseQuantity(product.productId, product.quantity);
                await importShipmentService.decreaseQuantity(product.importShipmentId, product.productId, product.quantity);
            }));
        }

        if(document.customerId) {
            const customerService = new CustomerService(MongoDB.client);
            customerService.increaseDue(document.customerId, document.total)
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
            new ApiError(500, "An error occurred while creating the export shipment")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const exportShipmentService = new ExportShipmentService(MongoDB.client);
        const document = await exportShipmentService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Export shipment not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving export shipment"));
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const exportShipmentService = new ExportShipmentService(MongoDB.client);
        const { date } = req.query;
        if(date) {
            documents = await exportShipmentService.findByDate(date);
        }
        else {
            documents = await exportShipmentService.find({});
        }
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving export shipments"))
    }

    return res.send(documents);
}