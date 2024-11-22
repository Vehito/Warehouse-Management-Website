<template>
    <h2 class="text-center">Xuất hàng</h2>
    <ExportShipmentForm
        @submit:shipment="createExportShipment"
    />
</template>

<script>
import ExportShipmentForm from '@/components/Form/ExportShipmentForm.vue';
import exportShipmentService from '@/services/exportShipment.service';


    export default {
        components: {
            ExportShipmentForm
        },

        methods: {
            async createExportShipment(data) {
                try {
                    await exportShipmentService.create(data);
                    alert("Xuất hàng thành công");
                    this.$router.push({ name: "importShipment" });
                } catch (error) {
                    alert(error.message);
                } 
            }
        }

    }
</script>