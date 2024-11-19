const { ObjectId, ReturnDocument } = require("mongodb");
const bcrypt = require('bcrypt');
const Date = require("../utils/date.util");

class EmployeeService {
    #Employee

    constructor(client) {
        this.#Employee = client.db().collection("employees");
    }

    #extractEmployeeData(payload) {
        const employee = {
            name: payload.name,
            birth: payload.birth,
            address: payload.address,
            role: payload.role,
            phone: payload.phone
        };

        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );

        return employee;
    }

    async create(payload) {
        const employee = this.#extractEmployeeData(payload);
        employee.password = this.#hashPassword(payload.password);
        const result = await this.#Employee.insertOne(employee);
        return result;
    }

    async find(filter) {
        const cursor = await this.#Employee.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: name,
        });
    }

    async findById(id) {
        return await this.#Employee.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const update = await this.#extractEmployeeData(payload);
        if(payload.newPassword && !payload.password) {
            update.password = await this.#hashPassword(payload.newPassword);
        }
        const result = await this.#Employee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.#Employee.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async login(account) {
        const employee = await this.findByName(account.username);
        if(!employee[0]) {
            return null;
        }
        const result = await this.#checkPassword(account.password, employee[0].password);
        if(result) {
            return employee[0];
        } else {
            return false;
        }
    }

        // Băm mật khẩu
    async #hashPassword(password) {
        const saltRounds = 10; // Số vòng băm, tăng sẽ tăng bảo mật nhưng chậm hơn
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    // Kiểm tra mật khẩu
    async #checkPassword(password, hashedPassword) {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}

module.exports = EmployeeService;