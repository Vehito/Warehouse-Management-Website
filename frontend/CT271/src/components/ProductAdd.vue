<script>
    import ProductService from '@/services/product.service';
    export default {

        data() {
            return {
                clicks: [],
                productsLocal: [],
                productsList: thi,
                getProducts() {
                    return this.productsLocal;
                }
            }
        },

        methods: {
            createInput() {
                this.clicks.push('');
            },

            async getProductsList() {
                this.productsList = await ProductService.getAll();
            }
        },

        mounted() {
            this.getProductsList();
        }
    }
</script>

<template>
    <button
        class="btn btn-sm btn-success"
        type="button"
        @click="createInput"
    >
        Thêm sản phẩm
    </button>


    <ul
        class="list-group"
    >
        <li
            class="mt-3 ml-5"
            v-for="(index) in clicks"
            :key="index"
        >
            <div class="">
                <div class="dropdown">
                    <button id="my-dropdown" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Lựa chọn sản phẩm: </button>
                    <div class="dropdown-menu" aria-labelledby="my-dropdown">
                        <a
                            v-for="(product) in productsList"
                            class="dropdown-item" href="#"
                        >
                            {{ product.name }}
                        </a>
                    </div>
                </div>
            </div>

            <input type="number">
            <input type="date">
            <input type="date">
        </li>
    </ul>

</template>