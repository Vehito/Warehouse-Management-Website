<template>
    <Form @submit="submitShipment" :validation-schema="shipmentFormSchema" class="form">
        <div class="form-group">
            <label
                v-if="typeOfForm === 'import'"
                for="entity"
            >
                Nhà cung cấp:
            </label>
            <Field name="entity" id="entity" type="text" class="form-control" v-model="shipmentLocal.entity" />
            <ErrorMessage name="entity" class="error-feedback" />
        </div>

        <div 
            v-for="(product, index) in productsLocal"
            :key="index"
        >

            <div class="from-group">
                <label :for="'product-' + index" class="mt-3">
                    Chọn loại sản phẩm
                </label>
                <Field 
                    as="select"
                    :name="'product-' + index"
                    :id="'product-' + index"
                    :class="{'is-invalid' : errors['product-' + index]}"
                    class="form-control"
                    v-model="productsLocal[index].productId"
                    @change="updatePrice(index)"
                >
                    <option v-if="!product._id" value="">Chọn...</option>

                    <option 
                        v-for="product in productList"
                        :key="product._id"
                        :value="product._id"
                    >
                        {{ product.name }}
                    </option>
                </Field>
            </div>

            <div class="row mt-3 ml-4">

                <div class="form-group mt-2 col">
                    <label :for="'quantity-' + index">Số lượng: </label>
                    <Field 
                        :name="'quantity-' + index" 
                        :id="'quantity-' + index" 
                        type="number"
                        class="form-control"
                        v-model="productsLocal[index].quantity"
                    />
                    <ErrorMessage :name="'quantity-' + index" class="error-feedback" />
                </div>

                <div class="form-group mt-2 col">
                    <label :for="'price-' + index">Giá sản phẩm: </label>
                    <Field 
                        :name="'price-' + index" 
                        :id="'price-' + index" 
                        type="number"
                        class="form-control"
                        v-model="productsLocal[index].price"
                        
                    />
                    <ErrorMessage :name="'price-' + index" class="error-feedback" />
                </div>

            </div>


            <div class="row ml-4">

                <div class="form-group col">
                    <label :for="'mfg-' + index">
                        Ngày sản xuất:
                    </label>
                    <Field 
                        :name="'mfg-' + index"
                        :id="'mfg-' + index"
                        type="date"
                        class="form-control"
                        @input="event => product.mfg = event.target.value"
                    />
                </div>
                <div class="form-group col">
                    <label :for="'exp-' + index">
                        Hạn sử dụng:
                    </label>
                    <Field 
                        :name="'exp-' + index"
                        :id="'exp-' + index"
                        type="date"
                        class="form-control"
                        @input="event => product.exp = event.target.value"

                    />
                </div>
            </div>
        </div>

        <div class="form-group mt-3 d-flex justify-content-around">
            <button 
                class="btn btn-sm btn-success" 
                type="button"
                @click="createInput"
                >
                Thêm sản phẩm
            </button>
        
            <button 
                class="btn btn-sm btn-secondary" 
                type="button"
                @click="removeLastInput"
                v-if="productsLocal.length > 1"
            >
                Xóa sản phẩm cuối
            </button>
        </div>
    
        <div class="form-group mt-4">
            <button class="btn btn-primary" type="submit">
                Lưu
            </button>
        </div>
    </Form>
</template>

<script>
import ProductService from '@/services/product.service';
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from "yup";

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        emits: ["submit:shipment"],

        props: {
            typeOfForm: { type: String, default: "" }
        },

        data() {
            const shipmentFormSchema = yup.object().shape({
                entity: yup
                        .string()
                        .required("Trường này không được trống.")
                        .min(2, "Tên phải chứa ít nhất 2 ký tự")
                        .max(75, "Tên có nhiều nhất 75 ký tự."),
                productsLocal: yup.array().of(
                yup.object().shape({
                    id: yup
                        .string()
                        .required("Vui lòng chọn sản phẩm"),

                    price: yup
                        .number()
                        .required("Giá sản phẩm không được trống")
                        .min(100, "Giá tối thiểu 100đ")
                        .max(9999999, "Giá tối đa 9.999.999đ"),

                    quantity: yup
                        .number()
                        .required("Số lượng sản phẩm không được trống")
                        .min(1, "Số lượng tối thiểu là 1")
                        .max(99, "Số lượng tối đa 99"),
                })
                ).min(1, "Phải có ít nhất 1 sản phẩm"),
            });
            return {
                productsLocal: [
                    {
                        productId: null,
                        price: 0,
                        quantity: 1,
                        mfg: new Date(),
                        exp: new Date(),
                    }
                ],
                shipmentLocal: {},
                productList: [],
                errors: {},
                shipmentFormSchema
            }
        },

        methods: {
            createInput() {
                this.productsLocal.push({
                    productId: null,
                    price: 0,
                    quantity: 1,
                    mfg: new Date(),
                    exp: new Date(),
                });
            },

            removeLastInput() {
                this.productsLocal.pop();
            },

            updatePrice(index) {
                const selectedProduct = this.productList.find(p => p._id === this.productsLocal[index].productId);
                if(selectedProduct) {
                    this.productsLocal[index].price = selectedProduct.purchasePrice;
                }
            },

            formatToYYYYMMDD(date) {
                if(!date) return;
                let d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if(month.length < 2) month = '0' + month;
                if(day.length < 2) day = '0' + day;
                return [year, month, day].join('-');
            },

            async getProductsList() {
                this.productList = await ProductService.getAll();
            },

            checkProductsLocal() {
                this.productsLocal.forEach((product, index) => {
                    if(!product.productId) {
                        throw new Error(`Sản phẩm thứ ${index+1} không hợp lệ`);
                    }
                    if(product.quantity < 1 || product.quantity > 99) {
                        throw new Error(`Số lượng sản phẩm thứ ${index+1} phải lớn hơn 1 và nhỏ hơn 99`)
                    }
                    if(product.price < 100 || product.price > 9999999) {
                        throw new Error(`Giá sản phẩm thứ ${index+1} phải trong khoảng 100đ - 9999999đ`);
                    }
                    // Chuyển đổi mfg và exp sang kiểu Date
                    const mfgDate = new Date(product.mfg);
                    const expDate = new Date(product.exp);
                    const today = new Date();

                    if (mfgDate > today) {
                        throw new Error(`Ngày sản xuất của sản phẩm thứ ${index + 1} không được là tương lai.`);
                    }

                    if (expDate <= mfgDate) {
                        throw new Error(`Hạn sử dụng của sản phẩm thứ ${index + 1} phải sau ngày sản xuất.`);
                    }
                });
                return true;
            },

            async submitShipment() {
                try{
                    const productValid = this.checkProductsLocal();
                    if(productValid) {
                        this.shipmentLocal.products = this.productsLocal
                        this.$emit("submit:shipment", this.shipmentLocal);
                    }   else {
                        alert("Có lỗi trong quá trình tạo lô hàng")
                    }
                }
                catch (error) {
                    alert(error);
                }
            }
        },

        async mounted() {
            await this.getProductsList();
        }
    }
</script>

<!-- <style scoped>
    .error-feedback{
        color: red;
    }
</style> -->