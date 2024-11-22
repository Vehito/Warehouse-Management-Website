const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ImportShipmentService {
    #ImportShipment;
    constructor(client) {
        this.#ImportShipment = client.db().collection("importShipments");
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
                stoke: detail.quantity,
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
            createdBy: payload.employeeId,
            products: products
        }
        const result = await this.#ImportShipment.insertOne(document);

        return result;
    }

    async findById(id) {
        return await this.#ImportShipment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
    }

    async findByDate(date) {
        const cursor = this.#ImportShipment.find({
            importDate: new RegExp(date)
        });

        return await cursor.toArray(); 
    }
 
    async find(filter) {
        const cursor = await this.#ImportShipment.find(filter);
        return await cursor.toArray();
    }

    async findWithProduct(productId, history=false) {
        const importShipments = await this.find({
            // _id: ObjectId.isValid(shipmentId) ? new ObjectId(shipmentId) : null,
            "products.productId": productId
        });

        if(importShipments.length === 0) {
            return [];
        }

        let result = [];
        importShipments.forEach((shipment) => {
            const info = shipment.products.find((product) => product.productId === productId);
            if(!history) {
                result.push({ 
                    _id: shipment._id, createdAt: shipment.createdAt,
                    stoke: info.stoke, quantity: info.quantity,
                    exp: info.exp, purchasePrice: info.purchasePrice
                });
            }
            else {
                if(info.stoke > 0) {
                    result.push({ 
                        shipmentId: shipment._id, createAt: shipment.createAt,
                        stoke: info.stoke, quantity: info.quantity,
                        exp: info.exp, purchasePrice: info.purchasePrice
                    });
                }
            }
            
        })
        return result;
    }

    async decreaseQuantity(shipmentId, productId, quantity) {
        const result = await this.#ImportShipment.findOneAndUpdate(
            { 
                _id: ObjectId.isValid(shipmentId) ? new ObjectId(shipmentId) : null,
                "products.productId": productId
            },
            {
                $inc: { "products.$.stoke": -quantity } // Sử dụng $ để tham chiếu đến phần tử phù hợp
            },
            {returnDocument: "after"}
        )
        return result;
    }
}

module.exports = ImportShipmentService;