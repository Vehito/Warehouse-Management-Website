const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ImportShipmentService {
    constructor(client) {
        this.ImportShipment = client.db().collection("importShipments");
    }

    async extractImportShipmentData(payload) {
        let importShipment = [];
        let total = 0;

        await Promise.all(payload.map(async (detail) => {
            const newItem = {
                productId: detail.productId,
                mfg: detail.mfg,
                exp: detail.exp,
                quantity: detail.quantity,
                purchasePrice: detail.price,
            };

            Object.keys(newItem).forEach(
                (key) => newItem[key] === undefined && delete newItem[key]
            );

            if(newItem){
                importShipment.push(newItem);
            }

            total += newItem.quantity * newItem.purchasePrice
        }));

        importShipment.total = total;

        return importShipment;
    }

    async create(payload) {
        const products = await this.extractImportShipmentData(payload.products);
        if(products.length === 0) {
            throw new ApiError(404, "Must have product(s)");
        }
        const document = {
            supplier: payload.entity,
            createdAt: new Date(),
            total: products.total,
            createdBy: "Từ Phước Nguyên",
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
        const cursor = this.ImportShipment.find({
            importDate: new RegExp(date)
        });

        return await cursor.toArray(); 
    }
 
    async find(filter) {
        const cursor = await this.ImportShipment.find(filter);
        return await cursor.toArray();
    }
}

module.exports = ImportShipmentService;