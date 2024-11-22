const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ExportShipmentService {
    #ExportShipment;
    constructor(client) {
        this.#ExportShipment = client.db().collection("exportShipments");
    }

    async #extractExportShipmentData(payload) {
        let exportShipment = [];
        let total = 0;

        await Promise.all(payload.map(async (detail) => {
            const newItem = {
                productId: detail.productId,
                importShipmentId: detail.importShipmentId,
                quantity: detail.quantity,
                salePrice: detail.price,
            };

            Object.keys(newItem).forEach(
                (key) => newItem[key] === undefined && delete newItem[key]
            );

            if(newItem){
                exportShipment.push(newItem);
            }

            total += newItem.quantity * newItem.salePrice
        }));

        exportShipment.total = total;

        return exportShipment;
    }

    async create(payload) {
        const products = await this.#extractExportShipmentData(payload.products);
        if(products.length === 0) {
            throw new ApiError(404, "Must have product(s)");
        }
        const document = {
            customerId: payload.customerId,
            createdAt: new Date(),
            total: products.total,
            createdBy: payload.employeeId,
            products: products
        }
        const result = await this.#ExportShipment.insertOne(document);
        return { "_id": result._id, "total": document.total, "customerId": document.customerId };
    }

    async findById(id) {
        return await this.#ExportShipment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
    }

    async findByDate(date) {
        const cursor = this.#ExportShipment.find({
            importDate: new RegExp(date)
        });

        return await cursor.toArray(); 
    }
 
    async find(filter) {
        const cursor = await this.#ExportShipment.find(filter);
        return await cursor.toArray();
    }
}

module.exports = ExportShipmentService;