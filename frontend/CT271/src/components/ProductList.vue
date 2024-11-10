<script>
    import ProductService from '@/services/product.service';
    export default {
        props: {
            products: { type: Array, default: () => [] },
        },

        mounted() {}
    };
</script>

<template>
    <ul class="list-group list-group-flush ml-5">
        <li 
            v-for="(product, index) in products"
            :key="index"
            class="mt-3 mb-3"
        >
            <p>Mã sản phẩm: {{ product.productId }}</p>

            <p
                v-if="product.name"
                >Tên sản phẩm: <strong>{{ product.name }}</strong>
            </p>

            <p v-else>
            <strong>Sản phẩm không tồn tại</strong>
            </p>

            <p>
                Số lượng: {{ product.quantity }}
                <span style="margin-left: 20px;"></span>
                Đơn giá nhập: {{ product.purchasePrice }}đ
            </p>
            <p>
                Ngày sản xuất: {{ product.mfg }}
                <span style="margin-left: 20px;"></span>
                Hạn sử dụng: {{ product.exp }}
            </p>
        </li>
    </ul>
</template>