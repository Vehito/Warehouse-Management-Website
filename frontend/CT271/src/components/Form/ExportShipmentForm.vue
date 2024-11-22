<template>
    <Form @submit="submitShipment" :validation-schema="shipmentFormSchema" class="form">
        <div class="form-group">
            <label :for="'customer'" class="mt-3">
                Chọn Khách hàng
            </label>
            <Field 
                as="select"
                :name="'customer'"
                :id="'customer'"
                :class="{'is-invalid' : errors['customer']}"
                class="form-control"
                v-model="shipmentLocal.customerId"
            >
                <option value="">Khách vãng lai</option>

                <option 
                    v-for="customer in customerList"
                    :key="customer._id"
                    :value="customer._id"
                >
                    {{ customer.name }}
                </option>
            </Field>
        </div>

        <div 
            v-for="(product, index) in productsLocal"
            :key="index"
            class="screen"
        >

            <div class="form-group">
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
                    @change="updatePrice(index), getImportShipment(index)"
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

            <div class="form-group mt-2 ml-5">
                <label :for="'importShipments-' + index" class="mt-3">
                    Chọn loại lô hàng
                </label>
                <Field 
                    as="select"
                    :name="'importShipments-' + index"
                    :id="'importShipments-' + index"
                    :class="{'is-invalid' : errors['importShipments-' + index]}"
                    class="form-control"
                    v-model="productsLocal[index].importShipmentId"
                    @change="validQuantity(index)"
                >
                    <option v-if="importShipments.length===0" value="" disabled>Không có sẵn trong kho hàng</option>

                    <option v-else-if="!productsLocal[index].importShipmentId" value="">Chọn...</option>

                    <option 
                        v-for="shipment in importShipments"
                        :key="shipment.shipmentId"
                        :value="shipment.shipmentId"
                    >
                        Tồn kho: {{ shipment.stoke }}, hết hạn: {{ shipment.exp }}
                    </option>
                </Field>
            </div>

            <div class="d-flex justify-content-between mt-3 ml-5">
                <div class="form-group mt-2">
                    <label :for="'quantity-' + index">Số lượng: </label>
                    <Field 
                        :name="'quantity-' + index"
                        name="quantity"
                        :id="'quantity-' + index" 
                        type="number"
                        class="form-control quantity"
                        v-model="productsLocal[index].quantity"
                    />
                    <ErrorMessage :name="'quantity-' + index" class="error-feedback" />
                </div>

                <div class="form-group mt-2 ">
                    <label :for="'price-' + index">Giá sản phẩm: </label>
                    <Field 
                        :name="'price-' + index" 
                        :id="'price-' + index" 
                        type="number"
                        class="form-control price"
                        v-model="productsLocal[index].price" 
                    />
                    <ErrorMessage :name="'price-' + index" class="error-feedback" />
                </div>
            </div>

        </div>

        <div class="form-group mt-3 d-flex justify-content-around ">
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
import importShipmentService from '@/services/importShipment.service';
import customerService from '@/services/customer.service';
import dateUtil from '@/utlis/date.util';
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from "yup";

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        emits: ["submit:shipment"],

        data() {
            const shipmentFormSchema = yup.object().shape({
                // entity: yup
                //         .string()
                //         .required("Trường này không được trống.")
                //         .min(2, "Tên phải chứa ít nhất 2 ký tự")
                //         .max(75, "Tên có nhiều nhất 75 ký tự."),
                // productsLocal: yup.array().of(
                // yup.array().of({
                //     id: yup
                //     .string()
                //     .required("Vui lòng chọn sản phẩm"),
                    
                //     price: yup
                //     .number()
                //     .required("Giá sản phẩm không được trống")
                //     .min(100, "Giá tối thiểu 100đ")
                //     .max(9999999, "Giá tối đa 9.999.999đ"),
                    
                //     quantity: yup
                //     .number()
                //     .required("Số lượng sản phẩm không được trống")
                //     .min(1, "Số lượng tối thiểu là 1")
                //     .max(99, "Số lượng tối đa 99"),
                // }))  
            });
            return {
                productsLocal: [
                    {
                        productId: null,
                        importShipmentId: null,
                        price: 0,
                        quantity: 1,
                        stoke: 0
                    }
                ],
                shipmentLocal: {},
                importShipments: [],
                productList: [],
                customerList: [],
                errors: {},
                shipmentFormSchema
            }
        },

        methods: {
            createInput() {
                this.productsLocal.push({
                    productId: null,
                    importShipmentId: null,
                    price: 0,
                    quantity: 1,
                    stoke: 0
                });
            },

            removeLastInput() {
                this.productsLocal.pop();
            },

            updatePrice(index) {
                const selectedProduct = this.productList.find(p => p._id === this.productsLocal[index].productId);
                if(selectedProduct) {
                    this.productsLocal[index].price = selectedProduct.salePrice;
                }
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
                    if(product.quantity > product.stoke) {
                        throw new Error(`Số lượng sản phẩm thứ ${index+1} không hợp lệ`);
                    }
                });
                return true;
            },

            validQuantity(index) {
                if(this.productsLocal[index].importShipmentId) {
                    this.productsLocal[index].stoke = 
                    this.importShipments.find(
                        (shipment) => shipment.shipmentId === this.productsLocal[index].importShipmentId
                    ).stoke;
                }
            },

            async submitShipment() {
                try{
                    const productValid = this.checkProductsLocal();
                    if(productValid) {
                        this.shipmentLocal.products = this.productsLocal
                        this.shipmentLocal.employeeId = this.$store.getters.user.id;
                        this.$emit("submit:shipment", this.shipmentLocal);
                    }   else {
                        alert("Có lỗi trong quá trình tạo lô hàng")
                    }
                }
                catch (error) {
                    alert(error);
                }
            },

            async getImportShipment(index) {
                const selectedProduct = this.productList.find(p => p._id === this.productsLocal[index].productId);
                if(selectedProduct) {
                    this.importShipments = await importShipmentService.getAll(selectedProduct._id);
                    this.importShipments.map(
                        (shipment) => shipment.exp = dateUtil.getStringDate(shipment.exp)
                    )
                }
            },

            async getCustomerList() {
                this.customerList = await customerService.getAll();
            }
        },

        async created() {
            await this.getProductsList();
            await this.getCustomerList();
        }
    }
</script>

<style>
.quantity,
.price {
    width: 200px;
}

.screen {
    width: 700px 
}
</style>
