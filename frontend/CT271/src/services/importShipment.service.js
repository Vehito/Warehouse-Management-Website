import createApiClient from "./api.service";

class ImportShipmentService {
    constructor(baseURL = "/api/importShipments") {
        this.api = createApiClient(baseURL);
    }

    async getAll () {
        try {
            return (await this.api.get("/")).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy tất cả lô hàng nhập");
        }
    }

    async create(data) {
        try {
            return (await this.api.post("/", data)).data;
        } catch (error) {
            throw new Error("Có lỗi khi tạo lô hàng nhập");
        }
    }

    async delete(id) {
        try {
            return (await this.api.delete(`/${id}`)).data;
        } catch (error) {
            throw new Error("Có lỗi khi xóa lô hàng nhập");
        }
    }

    async get(id) {
        try{ 
            return (await this.api.get(`/${id}`)).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy lô hàng nhập");;
        }
    }
}

export default new ImportShipmentService();