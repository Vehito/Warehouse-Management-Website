const { ObjectId, ReturnDocument } = require("mongodb");
const ProductController = require("../controllers/product.controller");
const Date = require("../utils/date.util");
const ApiError = require("../api-error");

class ImportShipmentService {
    constructor(client) {
        this.ImportShipment = client.db().collection("importShipments");
    }

    async extractImportShipmentData(payload) {
        let importShipment = [];

        await Promise.all(payload.map(async (detail) => {
            const newItem = {
                idProduct: detail.idProduct,
                mfg: Date.getDate(detail.mfg),
                exp: Date.getDate(detail.exp),
                quantity: detail.quantity,
                purchasePrice: detail.purchasePrice,
            };

            Object.keys(newItem).forEach(
                (key) => newItem[key] === undefined && delete newItem[key]
            );
        }));

        return importShipment;
    }

    async create(payload) {
        const products = await this.extractImportShipmentData(payload);
        if(products.length === 0) {
            throw new ApiError(404, "Must have product(s)");
        }
        const document = {
            importDate: Date.getCurrentDateTime(),
            products: products
        }
        const result = await this.ImportShipment.insertOne(document);

        return result;
    }

    async findById(id) {
        return await this.ImportShipment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
    }

    async findByDate(date) {
        const startDate = Date.getDate(date);
        const endDate = Date.getDate(date);
        endDate.setDate(endDate.getDate() + 1);
        const cursor = this.ImportShipment.find({
            importDate: { $gte: startDate, $lt:endDate }
        });

        return await cursor.toArray(); 
    }
 
    async find(filter) {
        const cursor = await this.ImportShipment.find(filter);
        return await cursor.toArray();
    }
}

module.exports = ImportShipmentService;