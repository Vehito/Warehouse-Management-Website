import createApiClient from "./api.service";

class EmployeeService {
    constructor(baseURL = "/api/employees") {
        this.api = createApiClient(baseURL);
    }

    async getAll () {
        try {
            return (await this.api.get("/")).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy tất cả nhân viên");
        }
    }

    async create(data) {
        try {
            return (await this.api.post("/", data)).data;
        } catch (error) {
            if(error.response.status === 409) {
                throw new Error("Nhân viên đã tồn tại");
            }
            throw new Error("Có lỗi khi tạo nhân viên");
        }
    }

    async update(id, data) {
        try {
            return (await this.api.put(`/${id}`, data)).data;
        }
        catch (error) {
            if(error.response && error.response.status === 409) {
                throw new Error("Nhân viên trùng tên với nhân viên khác");
            }
            else {
                throw new Error(`Có lỗi khi cập nhật nhân viên với id=${id}`);
            }
        }
    }

    async delete(id) {
        try {
            return (await this.api.delete(`/${id}`)).data;
        } catch (error) {
            throw new Error("Có lỗi khi xóa nhân viên");
        }
    }

    async get(id) {
        try{ 
            return (await this.api.get(`/${id}`)).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy nhân viên");;
        }
    }
}

export default new EmployeeService();