<template>
    <h2 class="text-center">Nhập hàng</h2>
    <ShipmentForm
        type-of-form="import"
        @submit:shipment="createImportShipment"
    />
</template>

<script>
import ShipmentForm from '@/components/Form/ShipmentForm.vue';
import ImportShipmentService from '@/services/importShipment.service';


    export default {
        components: {
            ShipmentForm
        },

        methods: {
            async createImportShipment(data) {
                try {
                    await ImportShipmentService.create(data);
                    alert("Nhập hàng thành công");
                    this.$router.push({ name: "importShipment" });
                } catch (error) {
                    alert(error.message);
                } 
            }
        }

    }
</script>