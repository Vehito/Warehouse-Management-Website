<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText"/>
        </div>

        <div class="col-12 text-center mt-3">
            <productsTable
                v-if="(filteredProductsCount > 0)"
                :name=tableName
                :tableHeaders=tableHeaders
                :btnContents=btnContents
                :btnStyles=btnStyles
                :tableRows=filteredProducts
                @clickBtn="clickBtn"
            />

            <p v-else-if="(searchText)">
                Không có sản phẩm chứ ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else >
                Không có sản phẩm
            </p>

        </div>

        <div class="mt-3 col-12 d-flex justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>

                <button class="btn btn-sm btn-success" @click="goToCreateProduct">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>

        </div>
        
    </div>
</template>

<script>
    import ProductService from '@/services/product.service';
    import InputSearch from '@/components/InputSearch.vue';
    import productsTable from '@/components/Table.vue';

    export default {
        components: {
            InputSearch,
            productsTable
        },

        data() {
            return {
                tableName: "Bảng sản phẩm",
                tableHeaders: [
                    { name: "Mã sản phẩm" , key: "id" },
                    { name: "Tên sản phẩm", key: "name"},
                    { name: "Giá bán", key: "salePrice" },
                    { name: "Giá mua", key: "purchasePrice" },
                    { name: "Tồn kho", key: "quantity" },
                ],
                products: [],
                searchText: "",
                btnContents: [
                    '<i class="fas fa-edit"></i> Thay đổi',
                    '<i class="fas fa-eye"></i> Lịch sử nhập hàng'
                ],
                btnStyles: [
                    'btn-primary btn-sm',
                    'btn-info btn-sm mt-2',
                ]
            };
        },

        computed: {
            productStrings() {
                return this.products.map((product) => {
                    const { _id, name, manufacturer } = product;
                    return [_id, name, manufacturer].join("");
                })
            },

            filteredProducts() {
                if(!this.searchText) return this.products;
                return this.products.filter((_product, index) => {
                    return this.productStrings[index].includes(this.searchText.trim())
                });
            },

            filteredProductsCount() {
                return this.filteredProducts.length;
            },
        },

        methods: {
            async retrieveProducts() {
                try {
                    this.products = await ProductService.getAll();
                }
                catch (error) {
                    alert(error.message);
                }
            },

            refreshList() {
                this.retrieveProducts();
                this.searchText = "";
            },

            clickBtn(id, btnIndex) {
                btnIndex === 0 ? this.goToEditProduct(id)
                               : this.goToProductImport(id);
            },

            goToEditProduct(id) {
                this.$router.push(
                    { 
                        name: "product.edit",
                        params: { id: id }
                    },
                );
            },

            goToProductImport(id) {
                this.$router.push(
                    { 
                        name: "product.import",
                        params: { id: id }
                    },
                );
            },

            goToCreateProduct() {
                this.$router.push(
                    {
                        name: "product.create",
                    },
                );
            },
        },

        mounted() {
            this.refreshList();
        }

    };
</script>