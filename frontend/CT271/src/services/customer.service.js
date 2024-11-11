import createApiClient from "./api.service";

class ImportShipmentService {
    constructor(baseURL = "/api/customers") {
        this.api = createApiClient(baseURL);
    }

    async getAll () {
        try {
            return (await this.api.get("/")).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy tất cả khách hàng");
        }
    }

    async create(data) {
        try {
            return (await this.api.post("/", data)).data;
        } catch (error) {
            if(error.response.status === 409) {
                throw new Error("Khách hàng đã tồn tại");
            }
            throw new Error("Có lỗi khi tạo khách hàng");
        }
    }

    async update(id, data) {
        try {
            return (await this.api.put(`/${id}`, data)).data;
        }
        catch (error) {
            if(error.response && error.response.status === 409) {
                throw new Error("Khách hàng trùng tên với khách hàng khác");
            }
            else {
                throw new Error(`Có lỗi khi cập nhật khách hàng với id=${id}`);
            }
        }
    }

    async delete(id) {
        try {
            return (await this.api.delete(`/${id}`)).data;
        } catch (error) {
            throw new Error("Có lỗi khi xóa khách hàng");
        }
    }

    async get(id) {
        try{ 
            return (await this.api.get(`/${id}`)).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy khách hàng");;
        }
    }
}

export default new ImportShipmentService();