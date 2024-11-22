const { ObjectId, ReturnDocument } = require("mongodb");
const Date = require("../utils/date.util");

class CustomerService {
    #Customer

    constructor(client) {
        this.#Customer = client.db().collection("customers");
    }

    extractProductData(payload) {
        const customer = {
            name: payload.name,
            company: payload.company,
            address: payload.address,
            debt: payload.debt,
            dueDate: payload.dueDate
        };

        Object.keys(customer).forEach(
            (key) => customer[key] === undefined && delete customer[key]
        );

        return customer;
    }

    async create(payload) {
        const customer = this.extractProductData(payload);
        customer.debt = 0;
        customer.dueDate = "";
        const result = await this.#Customer.insertOne(customer);
        return result;
    }

    async find(filter) {
        const cursor = await this.#Customer.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: name,
        });
    }

    async findById(id) {
        return await this.#Customer.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const update = this.extractProductData(payload);
        const result = await this.#Customer.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.#Customer.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async decreaseDue(customerId, money) {
        const result = await this.#Customer.findOneAndUpdate(
            { 
                _id: ObjectId.isValid(customerId) ? new ObjectId(customerId) : null,
            },
            {$dec: {due: money}},
            {returnDocument: "after"}
        )
        return result;
    }

    async increaseDue(customerId, money) {
        const result = await this.#Customer.findOneAndUpdate(
            { 
                _id: ObjectId.isValid(customerId) ? new ObjectId(customerId) : null,
            },
            {$inc: {"debt": money}},
            {returnDocument: "after"}
        )
        return result;
    }
}

module.exports = CustomerService;