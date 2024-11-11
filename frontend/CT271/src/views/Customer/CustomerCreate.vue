<template>
    <h4 class="text-center"> Tạo khách hàng </h4>
    <CustomerForm 
        :customer="customer"
        @submit:customer="createCustomer"
    />
</template>

<script>
    import CustomerForm from '@/components/Form/CustomerForm.vue';
    import customerService from '@/services/customer.service';
    
    export default {
        components: {
            CustomerForm,
        },

        data() {
            return {
                customer: {
                    name: "",
                    address: "",
                    company: ""
                }
            }
        },

        methods: {
            async createCustomer(data) {
                try {
                    await customerService.create(data);
                    this.$router.push({ name: "customer" });
                    window.alert("Khách hàng đã được tạo thành công");
                }
                catch (error) {
                    window.alert(error.message)
                };
            },

        },
    }
</script>