import createApiClient from "./api.service";

class authService {
    constructor(baseURL = "/api/auth") {
        this.api = createApiClient(baseURL);
    }

    async login(data) {
        try {
            return (await this.api.post("/login", data)).data;
        } catch (error) {
            if(error.response.status === 401) {
                throw new Error("Thông tin đăng nhập sai.");
            } 
            else if (error.response.status === 404) {
                throw new Error("Thông tin không tồn tại");
            }
            else {
                throw new Error("Có lỗi trong quá trình đăng nhập.");
            }
        }
    }

    async logout() {
        try {
            return (await this.api.post("/logout")).data;
        } catch (error) {
            if(error.response.status === 400) {
                throw new Error("Không có người dùng");
            }
            throw new Error("Có lỗi trong quá trình đăng xuất");
        }
    }
}

export default new authService();