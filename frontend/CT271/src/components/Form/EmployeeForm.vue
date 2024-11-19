<template>

    <Form 
        @submit="submitEmployee"
        :validation-schema="employeeFormSchema"
        class="d-flex flex-column align-items-center"
    >

        <Field
            hidden 
            name="id"
            id="id"
            type="hidden" 
            class="form-control"
            v-model="employeeLocal._id"
        />

        <div class="form-group">
            <label for="name">Tên nhân viên:</label>
            <Field 
                name="name"
                id="name"
                type="text" 
                class="form-control"
                v-model="employeeLocal.name"
            />
            <ErrorMessage class="error-feedback" name="name" />
        </div>

        <div class="form-group" v-if="!employeeLocal._id">
            <label for="password">Mật khẩu:</label>
            <Field
                name="password"
                id="password"
                type="password" 
                class="form-control"
                v-model="employeeLocal.password"
            />
            <ErrorMessage class="error-feedback" name="password" />
        </div>

        <div class="form-group">
            <label for="birth">Ngày sinh:</label>
            <Field 
                name="birth"
                id="birth"
                type="date"
                class="form-control"
                :value="new Date(employeeLocal.birth).toISOString().split('T')[0]"
                @input="event => employeeLocal.birth = event.target.value"
            />
            <ErrorMessage class="error-feedback" name="birth" />
        </div>

        <div class="form-group">
            <label for="position">Chức vụ:</label>
            <Field 
                name="position"
                id="position"
                type="text" 
                class="form-control"
                v-model="employeeLocal.role"
            />
            <ErrorMessage class="error-feedback" name="position" />
        </div>

        <div class="form-group">
            <label for="address">Địa chỉ:</label>
            <Field
                name="address"
                id="address"
                type="text"
                class="form-control"
                v-model="employeeLocal.address"
            />
            <ErrorMessage class="error-feedback" name="address" />
        </div>

        <div class="form-group">
            <label for="phone">Số điện thoại:</label>
            <Field
                name="phone"
                id="phone"
                type="text"
                class="form-control"
                v-model="employeeLocal.phone"
            />
            <ErrorMessage class="error-feedback" name="phone" />
        </div>


        <div class="form-group" v-if="employeeLocal._id" >
            <label for="newPassword">Mật khẩu mới:</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    <label for="ischangedPwd" class="mt-2">Không đổi mật khẩu:</label>
                    <Field
                        name="ischangedPwd"
                        id="ischangedPwd"
                        type="checkbox" 
                        class=""
                        @change="changePassword"
                    />
                    </div>
                </div>

                <Field 
                    v-if="ischangedPwd"
                    name="newPassword"
                    id="newPassword"
                    type="password" 
                    class="form-control"
                    @input="event => employeeLocal.newPassword = event.target.value"
                />
            </div>
            <footer v-if="ischangedPwd" class="blockquote-footer">Để trống nếu không muốn thay đổi</footer>
            <ErrorMessage class="error-feedback" name="newPassword" />
        </div>

        <div class="form-group mt-3 d-flex justify-content-around">
            <button class="btn btn-primary" type="submit">Lưu</button>

            <button 
                class="btn btn-danger"
                type="button"
                v-if="employeeLocal._id"
                @click="deleteEmployee"
            >
                Xóa
            </button>

            <button 
                class="btn btn-danger"
                type="button"
                @click="Cancel"
            >
                Thoát
            </button>
        </div>

    </Form>

</template>

<script>
import * as yup from "yup"
import { Form, Field, ErrorMessage, validate, } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage
    },

    emits: ["submit:employee", "delete:employee"],

    props: {
        employee: { type: Object, required: true }
    },

    data() {
        let employeeFormSchema = yup.object().shape({
            id: yup.string(),
            name: yup
                    .string()
                    .required("Tên phải tồn tại.")
                    .max(75, "Tối đa 75 ký tự")
                    .min(1, "Tối thiểu 1 ký tự"),
            password: yup
                    .string()
                    .when('id', {
                        is: undefined,
                        then: (schema) => schema.required("Mật khẩu phải tồn tại")
                                                .max(30, "Tối đa 30 ký tự")
                                                .min(6, "Tối thiểu 6 ký tự"),
                        otherwise: (schema) => schema.notRequired()
                    }),
            birth: yup
                    .date()
                    .required("Ngày sinh phải tồn tại")
                    .max(new Date(), "Ngày sinh không thể lớn hơn ngày hiện tại"),
            position: yup
                    .string()
                    .required("Chức vụ phải tồn tại.")
                    .max(75, "Tối đa 75 ký tự")
                    .min(1, "Tối thiểu 1 ký tự"),
            address: yup
                    .string()
                    .required("Địa chỉ phải tồn tại")
                    .max(100, "Tối đa 100 ký tự"),
            phone: yup
                    .string()
                    .matches(
                        /((09|03|07|08|05)+([0-9]{8})\b)/g,
                        "Số điện thoại không hợp lệ."
                    ),
            newPassword: yup
                    .string()
                    .when('ischangedPwd', {
                        is: 'on',
                        then: (schema) => schema.required("Mật khẩu mới phải tồn tại")
                                                .max(30, "Tối đa 30 ký tự")
                                                .min(6, "Tối thiểu 6 ký tự"),
                        otherwise: (schema) => schema.notRequired()
                    })
        });
        return {
            employeeLocal: this.employee,
            employeeFormSchema,
            ischangedPwd: false,
        };
    },

    methods: {
        submitEmployee() {
            if (this.ischangedPwd === true) {
                delete this.employeeLocal.password;
            }
            this.$emit("submit:employee", this.employeeLocal);
        },

        deleteEmployee() {
            this.$emit("delete:employee", this.employeeLocal._id)
        },

        Cancel() {
            const reply = window.confirm("You have unsave changes! Do you wanna leave?")

            if(!reply) {
                return false;
            }
            else this.$router.push({ name: "employee" });
        },

        changePassword() {
            this.ischangedPwd = !this.ischangedPwd;
        }
    }
}

</script>

<style>
@import "../../assets/form.css";
.form-control,
.form-group {
    width: 700px
}

#ischangedPwd{
    position: relative;
    margin-left: 10px;
    margin-top: 6px;
}

#newPassword {
    height: 51px;
}
</style>