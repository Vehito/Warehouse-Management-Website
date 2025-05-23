import { ErrorMessage } from "vee-validate";
import createApiClient from "./api.service";
import { errorMessages } from "vue/compiler-sfc";

class ProductService {
    constructor(baseURL = "/api/products"){
        this.api = createApiClient(baseURL);
    }

    async getAll() {
        try{ 
            return (await this.api.get("/")).data;
        }
        catch (error) {
            throw new Error("Có lỗi khi lấy tất cả sản phẩm");
        }
    }

    async create(data) {
        try {
            return (await this.api.post("/", data)).data;
        }
        catch (error) {
            if(error.response && error.response.status === 409){
                throw new Error("Sản phẩm đã tồn tại");
            }
            else {
                throw new Error("Có lỗi khi tạo sản phẩm");
            }
        }
    }

    async delete(id) {
        try{ 
            return (await this.api.delete(`/${id}`)).data;
        }
        catch (error) {
            throw new Error(`Có lỗi khi xóa sản phẩm với id=${id}`);
        }
    }

    async get(id) {
        try{ 
            return (await this.api.get(`/${id}`)).data;
        }
        catch (error) {
            throw new Error(`Có lỗi khi lấy sản phẩm với id=${id}`);
        }
    }

    async update(id, data) {
        try {
            return (await this.api.put(`/${id}`, data)).data;
        }
        catch (error) {
            if(error.response && error.response.status === 409) {
                throw new Error("Sản phẩm trùng tên với sản phẩm khác");
            }
            else {
                throw new Error(`Có lỗi khi cập nhật sản phẩm với id=${id}`);
            }
        }
    }

}

export default new ProductService();