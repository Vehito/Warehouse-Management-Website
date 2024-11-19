<template>
    <Form 
        @submit="submitLogin" 
        :validation-schema="loginFormSchema"
        class="d-flex flex-column align-items-center"
    >
        <div class="form-group">
            <label for="username">Tên đăng nhập:</label>
            <Field 
                name="username"
                id="username"
                type="text" 
                class="form-control"
                v-model="accountLocal.username"
            />
            <ErrorMessage class="error-feedback" name="username" />
        </div>

        <div class="form-group">
            <label for="password">Mật khẩu:</label>
            <Field 
                name="password"
                id="password"
                type="password" 
                class="form-control"
                v-model="accountLocal.password"
            />
            <ErrorMessage class="error-feedback" name="password" />
        </div>

        <div class="form-group mt-5 d-flex justify-content-around">
            <button class="btn btn-primary" type="submit">Đăng nhập</button>
        </div>

    </Form>
</template>

<script>
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from "yup";

    export default {
        components: {
            Field,
            Form,
            ErrorMessage
        },

        props: {
            account: { type: Object, required: true }
        },

        emits: ["submit:login"],

        data() {
            const loginFormSchema = yup.object().shape({
                username: yup
                            .string()
                            .required("Tên nhân viên là bắt buộc.")
                            .max(75, "Tối đa 75 ký tự.")
                            .min(1, "Tối thiểu 1 ký tự"),
                password: yup
                            .string()
                            .required("Mật khẩu là bắt buộc.")
                            .max(30, "Tối đa 30 ký tự.")
                            .min(6, "Tối thiểu 6 ký tự"),
            });

            return {
                loginFormSchema,
                accountLocal: this.account,
            }
        },

        methods: {
            submitLogin() {
                this.$emit("submit:login", this.accountLocal);
            }
        }
    }
</script>