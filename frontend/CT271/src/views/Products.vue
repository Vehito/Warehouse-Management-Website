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
                :tableRows=filteredProducts
            />

            <p v-else-if="(searchText)">
                Không có sản phẩm chứ ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else>
                Không có sản phẩm
            </p>

        </div>

        <div class="mt-3 col-12 d-flex justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>

                <button class="btn btn-sm btn-success" @click="goToAddProduct">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>

                <button class="btn btn-sm btn-danger" @click="removeAllProducts">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
        </div>
        
    </div>
</template>

<script>
    import ProductService from '@/services/product.service';
    import InputSearch from '@/components/inputSearch.vue';
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
                    { name: "Tồn kho", key: "quantity" }
                ],
                products: [],
                searchText: ""
            };
        },

        computed: {
            productStrings() {
                return this.products.map((product) => {
                    const { id, name, manufacturer } = product;
                    return [id, name, manufacturer].join("");
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
                    console.error(error);
                }
            },

            refreshList() {
                this.retrieveProducts();
                this.searchText = "";
            },

            async removeAllProducts() {
                if(confirm("Bạn muốn xóa tất cả Sản phẩm")) {
                    try {
                        await ProductService.deleteAll();
                        this.refreshList();
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            },

            goToAddProduct() {
                this.$router.push({ name: "product.add" });
            }
        },

        mounted() {
            this.refreshList();
        }

    };
</script>

<!-- <div class="mt-3 col-md-6">
            <h4>
                Danh sách sản phẩm
            </h4>

            <ProductList
                v-if="filteredProductsCount > 0"
                :products="filteredProducts"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có sản phẩm nào.</p>

            
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeProduct">
                <h4>
                    Chi tiết Sản phẩm
                </h4>
                <ProductCard :product="activeProduct" />
            </div>
        </div> -->