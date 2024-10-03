<template>
    <Form ref="form" :validation-schema="productFormSchema" class="form">
        <div class="form-group">
            <label for="name"> Tên: </label>
            <Field name="name" id="name" type="text" class="form-control" v-model="productLocal.name"/>
            <ErrorMessage name="name" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="manufacturer"> Nhà sản xuất: </label>
            <Field name="manufacturer" id="manufacturer" type="text" class="form-control" v-model="productLocal.manufacturer"/>
            <ErrorMessage name="manufacturer" class="error-feedback" />
        </div>


        <div class="form-group">
            <label for="purchasePrice"> Giá mua: </label>
            <Field name="purchasePrice" id="purchasePrice" type="number" class="form-control" v-model="productLocal.purchasePrice"/>
            <ErrorMessage name="purchasePrice" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="salePrice"> Giá bán: </label>
            <Field name="salePrice" id="salePrice" type="number" class="form-control" v-model="productLocal.salePrice"/>
            <ErrorMessage name="salePrice" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary" @click="submitProduct">Lưu</button>
            <button v-if="productLocal._id" type="button"class="btn ml-2 btn-danger" @click="deleteProduct">
                Xóa
            </button>
            <button class="btn btn-danger ml-2" type="button" @click="Cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>

<script>
    import * as yup from "yup";
    import { Form, Field, ErrorMessage } from "vee-validate";
    import { errorMessages } from "vue/compiler-sfc";

    export default {
        components: {
            Form,
            Field,
            ErrorMessage
        },

        emits: ["submit:product", "delete:product"],

        props: {
            product: { type: Object, required: true }
        },

        data() {
            const productFormSchema = yup.object().shape({
                name: yup
                      .string()
                      .required("Tên sản phẩm không được trống.")
                      .min(2, "Tên phải chứa ít nhất 2 ký tự")
                      .max(75, "Tên có nhiều nhất 75 ký tự."),
                
                manufacturer: yup
                              .string()
                              .required("Tên nhà sản xuất sản phẩm không được trống.")
                              .min(2, "Tên nhà sản xuất phải chứa ít nhất 2 ký tự")
                              .max(75, "Tên nhà sản xuất có nhiều nhất 75 ký tự."),

                purchasePrice: yup
                               .number("Vui lòng nhập số vào giá mua")
                               .required("Giá nhập vào không được trống")
                               .min(1, "Giá nhập ít nhất là 1đ")
                               .max(9999999, "Giá nhập vào cao nhất là 9.999.999đ"),

                salePrice: yup
                           .number("Vui lòng nhập số vào giá bán")
                           .required("Giá bán không được trống")
                           .min(1, "Giá bán ít nhất là 1đ")
                           .max(9999999, "Giá bán cao nhất là 9.999.999đ"),
            });
            return {
                productLocal: this.product,
                productFormSchema,
            };
        },

        methods: {
            async submitProduct() {
                const isValid = await this.$refs.form.validate();
                if(isValid.valid){
                    this.$emit("submit:product", this.productLocal);
                }
                else {
                    alert("Thông tin không hợp lệ");
                }
            },
            deleteProduct() {
                this.$emit("delete:product", this.productLocal._id);
            },
            Cancel() {
                const reply = window.confirm("Bạn chưa lưu những thay đổi! Bạn có muốn rời đi không ?")
                if(!reply){
                    return false;
                }
                else {
                    this.$router.push({ name: "products" });
                }
            }
        },
    };
</script>

<style>
    @import "@/assets/form.css";
</style>