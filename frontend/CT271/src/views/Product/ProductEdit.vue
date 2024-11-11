<template>
    <div class="page" v-if="product && !loading">
        <h4 class="text-center text-secondary">Cập nhật Sản phẩm</h4>
            <ProductForm
                :product="product" 
                @submit:product="updateProduct"
                @delete:product="deleteProduct"
            />
            <p>{{ message }}</p>
    </div>
    <h2 v-else-if="!loading" class="text-center">Sản phẩm không tồn tại</h2>
    <p v-else class="text-center">Đang tải sản phẩm...</p>
</template>

<script>
    import ProductForm from '@/components/Form/ProductForm.vue';
    import ProductService from '@/services/product.service';

    export default {
        components: {
            ProductForm,
        },

        data() {
            return {
                product: null,
                loading: true,
                message: "",
            };
        },

        methods: {
            async getProduct() {
                const id = this.$route.params.id;
                try {
                    this.product = await ProductService.get(id);
                }
                catch (error) {
                    console.error(error);
                    this.$router.push({
                        name: "notfound",
                        params: {
                            pathMatch: this.$router.path.split("/").slice(1)
                        },
                        query: this.$route.query,
                        hash: this.$route.hash
                    });
                }
                finally {
                    this.loading = false;
                }
            },

            async updateProduct(data) {
                try {
                    await ProductService.update(this.product._id, data);
                    alert("Sản phẩm được cập nhật thành công.");
                    this.$router.push({ name: "product" });
                }
                catch (error) {
                    alert(error.message);
                };
            },

            async deleteProduct() {
                if(confirm(`Bạn muốn xóa sản phẩm ${this.product.name} ?`)) {
                    try {
                        await ProductService.delete(this.product._id);
                        this.$router.push({ name: "product" });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            },
        },

        async mounted() {
            await this.getProduct();
            this.message = "";
        }
    };
</script>