<script>
    export default {
        props: {
            product: { type: Object, required: true },
        },
    };
</script>

<template>
    <div>
        
        <div class="p-1">
            <strong>Tên sản phẩm: </strong>
            {{ product.name }}
        </div>

        <div class="p-1">
            <strong>Tồn kho: </strong>
            {{ product.quantity }}
        </div>

        <div class="p-1">
            <strong>Nhà sản xuất: </strong>
            {{ product.manufacturer }}
        </div>

    </div>
</template>