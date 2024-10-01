import createApiClient from "./api.service";

class ProductService {
    constructor(baseURL = "/api/products"){
        this.api = createApiClient(baseURL);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
}

export default new ProductService();