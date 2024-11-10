<script>
    import ProductList from '@/components/ProductList.vue';

    export default {
        components: {
            ProductList
        },

        props: {
            dataShipment: { type: Object, required: false }
        }
    }
</script>

<template>
    <div class="mt-5">
        <p>Mã lô hàng nhập: {{ dataShipment._id }}</p>
        <p>
            Người tạo: {{ dataShipment.createdBy }}
            <span style="margin-left: 20px;"></span>
            Thời gian tạo: {{ dataShipment.createdAt }}
        </p>
        <p>Nhà cung cấp: {{ dataShipment.supplier }}</p>
        <p>Sản phẩm:</p>
        <ProductList 
            :products="dataShipment.products"
        />
        <p>Tổng tiền: {{ dataShipment.total }}đ</p>
    </div>
</template>
