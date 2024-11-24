<template>
    <h2 class="text-center mt-3">
        Thông tin chi tiết lô hàng nhập
    </h2>

    <p>Mã lô hàng nhập: {{ importShipment._id }}</p>
        <p>
            Người tạo: {{ employee.name }}
            <span style="margin-left: 20px;"></span>
            Thời gian tạo: {{ importShipment.createdAt }}
        </p>
        <p>Nhà cung cấp: {{ importShipment.supplier }}</p>
        <p>Sản phẩm:</p>

        <ProductsTable 
            :tableHeaders="tableHeader"
            :tableRows="importShipment.products"
        />

        <div class="mt-3 d-flex justify-content-around">
            <button 
                class="btn btn-primary"
                type="button"
            >
                <RouterLink 
                    :to="{ name: 'importShipment' }"
                    class="text-white"
                >
                    Thoát
                </RouterLink>
            </button>
        </div>
</template>

<script>
    // import ShipmentDetail from '@/components/ShipmentDetail.vue';
    import ImportShipmentService from '@/services/importShipment.service';
    import ProductService from '@/services/product.service';
    import dateUtil from '@/utlis/date.util';
    import ProductsTable from '@/components/Table.vue';
    import employeeService from '@/services/employee.service';

    export default {
        components: {
            ProductsTable
        },

        data() {
            return {
                importShipment: {},
                productList: [],
                tableHeader: [
                    { key: "_id", name: "ID" },
                    { key: "name", name: "Tên sản phẩm" },
                    { key: "quantity", name: "Số lượng" },
                    { key: "stoke", name: "Tồn kho" },
                    { key: "purchasePrice", name: "Giá mua" },
                    { key: "mfg", name: "Ngày sản xuất" },
                    { key: "exp", name: "Hạn sử dụng" },
                ],
                employee: {},
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

            async retrieveEmployee() {
                this.employee = await employeeService.get(this.importShipment.createdBy);
            },

            async retrieveImportShipment() {
                try {
                    this.importShipment = await ImportShipmentService.get(this.$route.params.id);
                    this.importShipment.createdAt = dateUtil.getStringDateTime(this.importShipment.createdAt);
                    this.importShipment.products.map((product) => {
                        product._id = product.productId
                        product.mfg = dateUtil.getStringDate(product.mfg);
                        if(dateUtil.isOverdue(product.exp)) {
                            product.exp = dateUtil.getStringDate(product.exp) + " " + "HẾT HẠN";
                        }
                        else {
                            product.exp = dateUtil.getStringDate(product.exp);
                        }
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
            await this.retrieveImportShipment();
            await this.retrieveEmployee();
        }
    }
</script>