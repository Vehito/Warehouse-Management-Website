<template>
    <Form @submit="submitCustomer" :validation-schema="customerFormSchema" class="form">

        <Field 
            hidden
            type="hidden"
            name="id"
            v-model="customerLocal._id"
        />

        <div class="form-group">
            <label for="name"> Tên khách hàng: </label>
            <Field name="name" id="name" type="text" class="form-control" v-model="customerLocal.name"/>
            <ErrorMessage name="name" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="company"> Công ty: </label>
            <Field name="company" id="company" type="text" class="form-control" v-model="customerLocal.company"/>
            <ErrorMessage name="company" class="error-feedback" />
        </div>


        <div class="form-group">
            <label for="address"> Địa chỉ: </label>
            <Field name="address" id="address" type="text" class="form-control" v-model="customerLocal.address"/>
            <ErrorMessage name="address" class="error-feedback" />
        </div>

        <div class="form-group" v-if="customerLocal._id">
            <label for="debt"> Nợ </label>
            <Field name="debt" id="debt" type="number" class="form-control" v-model="customerLocal.debt"/>
            <ErrorMessage name="debt" class="error-feedback" />
        </div>

        <div class="form-group" v-if="customerLocal._id">
            <label for="dueDate"> Hạn trả: </label>
            <Field name="dueDate" id="dueDate" type="date" class="form-control" v-model="customerLocal.dueDate"/>
            <ErrorMessage name="dueDate" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary" type="submit">Lưu</button>
            <button v-if="customerLocal._id" type="button"class="btn ml-2 btn-danger" @click="deleteCustomer">
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

    export default {
        components: {
            Form,
            Field,
            ErrorMessage
        },

        emits: ["submit:customer", "delete:customer"],

        props: {
            customer: { type: Object, required: true }
        },

        data() {
            const customerFormSchema = yup.object().shape({
                name: yup
                      .string()
                      .required("Tên khách hàng không được trống.")
                      .min(2, "Tên khách hàng phải chứa ít nhất 2 ký tự")
                      .max(75, "Tên khách hàng có nhiều nhất 75 ký tự."),
                
                company: yup
                        .string()
                        .notRequired()
                        .min(2, "Tên công ty phải chứa ít nhất 2 ký tự")
                        .max(75, "Tên công ty có nhiều nhất 75 ký tự."),

                address: yup
                        .string()
                        .required("Địa chỉ không được trống.")
                        .min(1, "Địa chỉ phải chứa ít nhất 1 ký tự")
                        .max(75, "Địa chỉ có nhiều nhất 75 ký tự."),

                debt: yup
                        .number()
                        .when('id', {
                            is: undefined,
                            then: (schema) => schema.notRequired(),
                            otherwise: (schema) => schema.required("Nợ không được trống")
                                                         .min(0, "Nợ nhỏ nhất là 0"),
                            
                        }),

                dueDate: yup
                        .date()
                        .when(['debt', 'id'], ([debt, id], schema) => {
                            (debt===0 || id===undefined) ?
                                schema.notRequired() :
                                schema.required("Hạn trả phải có")
                                      .min(new Date(), "Hạn phải ít nhất là hôm nay")
                        })
            });
            return {
                customerLocal: this.customer,
                customerFormSchema,
            };
        },

        methods: {
            async submitCustomer() {
                this.$emit("submit:customer", this.customerLocal);
            },
            deleteCustomer() {
                this.$emit("delete:customer", this.customerLocal._id);
            },
            Cancel() {
                const reply = window.confirm("Bạn chưa lưu những thay đổi! Bạn có muốn rời đi không ?")
                if(!reply){
                    return false;
                }
                else {
                    this.$router.push({ name: "customer" });
                }
            }
        },
    };
</script>

<style>
    @import "@/assets/form.css";
</style>