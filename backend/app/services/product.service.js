const { ObjectId, ReturnDocument } = require("mongodb");
const Date = require("../utils/date.util");

class ProductService {
    #Product;
    constructor(client) {
        this.#Product = client.db().collection("products");
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,
            manufacturer: payload.manufacturer,
            salePrice: payload.salePrice,
            purchasePrice: payload.purchasePrice,
            quantity: payload.quantity,
            createdAt: Date.getCurrentDate(),
            imgUrl: payload.imgUrl
        };

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );

        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        product.quantity = 0;
        const result = await this.#Product.insertOne(product);
        return result;
    }

    async find(filter) {
        const cursor = await this.#Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        }).toArray();
    }

    async findProductWithName(name) {
        return await this.find({
            name: name
        });
    }

    async findById(id) {
        return await this.#Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByIds(ids) {
        if(!Array.isArray(ids) || ids.length === 0) return [];

        return await this.#Product.find({
            _id: {$in: ids.map(id => ObjectId.isValid(id) ? new ObjectId(id) : null)}
        }).toArray();
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const update = this.extractProductData(payload);
        const result = await this.#Product.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.#Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.#Product.deleteMany({});
        return result.deletedCount;
    }

    async increaseQuantity(id, quantity) {
        const result = await this.#Product.findOneAndUpdate(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null},
            {$inc: {quantity: quantity}},
            {returnDocument: "after"}
        )
        return result;
    }

    async decreaseQuantity(id, quantity) {
        const result = await this.#Product.findOneAndUpdate(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null},
            {$inc: {quantity: -quantity}},
            {returnDocument: "after"}
        )
        return result;
    }

}

module.exports = ProductService;