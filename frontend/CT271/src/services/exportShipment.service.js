import createApiClient from "./api.service";

class ImportShipmentService {
    constructor(baseURL = "/api/exportShipments") {
        this.api = createApiClient(baseURL);
    }

    async getAll (productId = null) {
        try {
            if(productId) {
                return (await this.api.get(`?productId=${productId}`)).data;
            }
            return (await this.api.get("/")).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy tất cả lô hàng xuất");
        }
    }

    async create(data) {
        try {
            return (await this.api.post("/", data)).data;
        } catch (error) {
            throw new Error("Có lỗi khi tạo lô hàng xuất");
        }
    }

    async delete(id) {
        try {
            return (await this.api.delete(`/${id}`)).data;
        } catch (error) {
            throw new Error("Có lỗi khi xóa lô hàng xuất");
        }
    }

    async get(id) {
        try{ 
            return (await this.api.get(`/${id}`)).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy lô hàng xuất");;
        }
    }
}

export default new ImportShipmentService();