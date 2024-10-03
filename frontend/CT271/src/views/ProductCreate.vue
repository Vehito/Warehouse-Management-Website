<template>
    <h4 class="text-center"> Tạo sản phẩm </h4>
    <ProductForm 
        :product="product"
        @submit:product="createProduct"
    />
</template>

<script>
    import ProductForm from '@/components/ProductForm.vue';
    import ProductService from '@/services/product.service';
    
    export default {
        components: {
            ProductForm,
        },

        data() {
            return {
                product: {
                    name: "", manufacturer: "", 
                    purchasePrice: 0 , salePrice: 0
                }
            }
        },

        methods: {
            async createProduct(data) {
                try {
                    await ProductService.create(data);
                    this.$router.push({ name: "products" });
                    window.alert("Sản phẩm đã được tạo thành công");
                }
                catch (error) {
                    window.alert(error.message)
                };
            },

        },

        mounted() {}
    }
</script>