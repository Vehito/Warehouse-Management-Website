<template>
    <h2 class="text-center mt-3">
        Thông tin chi tiết lô hàng xuất
    </h2>

    <p>Mã lô hàng xuất: {{ exportShipment._id }}</p>
        <p>
            Người tạo: {{ employee.name }}
            <span style="margin-left: 20px;"></span>
            Thời gian tạo: {{ exportShipment.createdAt }}
        </p>
        <p>Khách hàng: {{ customer.name }}</p>
        <p>Sản phẩm:</p>

        <ProductsTable 
            :tableHeaders="tableHeader"
            :tableRows="exportShipment.products"
        />

        <div class="mt-3 d-flex justify-content-around">
            <button 
                class="btn btn-primary"
                type="button"
            >
                <RouterLink 
                    :to="{ name: 'exportShipment' }"
                    class="text-white"
                >
                    Thoát
                </RouterLink>
            </button>
        </div>
</template>

<script>
    import exportShipmentService from '@/services/exportShipment.service';
    import customerService from '@/services/customer.service';
    import employeeService from '@/services/employee.service';
    import ProductService from '@/services/product.service';
    import dateUtil from '@/utlis/date.util';
    import ProductsTable from '@/components/Table.vue';

    export default {
        components: {
            ProductsTable
        },

        data() {
            return {
                exportShipment: {},
                productList: [],
                tableHeader: [
                    { key: "_id", name: "ID" },
                    { key: "name", name: "Tên sản phẩm" },
                    { key: "quantity", name: "Số lượng" },
                    { key: "salePrice", name: "Giá bán" },
                ],
                employee: {},
                customer: {}
            }
        },

        methods: {
            async getProductList() {
                try {
                    this.productList = await ProductService.getAll();
                } catch (error) {
                    alert(error);
                }
            },

            async retrieveCustomer() {
                this.customer = await customerService.get(this.exportShipment.customerId);
            },

            async retrieveEmployee() {
                this.employee = await employeeService.get(this.exportShipment.createdBy);
            },

            async retrieveExportShipment() {
                try {
                    this.exportShipment = await exportShipmentService.get(this.$route.params.id);
                    this.exportShipment.createdAt = dateUtil.getStringDateTime(this.exportShipment.createdAt);
                    this.exportShipment.products.map((product) => {
                        product._id = product.productId
                        product.name = this.getProductName(product.productId)
                    })
                } catch (error) {
                    alert(error.message);
                }
            },

            getProductName(id) {
                const product = this.productList.find((product) => product._id === id)
                return product.name;
            }
        },

        async created() {
            await this.getProductList();
            await this.retrieveExportShipment();
            await this.retrieveEmployee();
            if(this.exportShipment.customerId) {
                await this.retrieveCustomer();
            } else {
                this.customer.name = "Khách vãng lai";
            }
        }
    }
</script>