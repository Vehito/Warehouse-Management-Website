<template>
    <div class="page" v-if="customer && !loading">
        <h4 class="text-center text-secondary">Cập nhật Khách hàng</h4>
            <CustomerForm
                :customer="customer" 
                @submit:customer="updateCustomer"
                @delete:customer="deleteCustomer"
            />
            <p>{{ message }}</p>
    </div>
    <h2 v-else-if="!loading" class="text-center">Khách hàng không tồn tại</h2>
    <p v-else class="text-center">Đang tải khách hàng...</p>
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
                customer: null,
                loading: true,
                message: "",
            };
        },

        methods: {
            async getCustomer() {
                const id = this.$route.params.id;
                try {
                    this.customer = await customerService.get(id);
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

            async updateCustomer(data) {
                try {
                    await customerService.update(this.customer._id, data);
                    alert("Khách hàng được cập nhật thành công.");
                    this.$router.push({ name: "customer" });
                }
                catch (error) {
                    alert(error.message);
                };
            },

            async deleteCustomer() {
                if(confirm(`Bạn muốn xóa khách hàng ${this.customer.name} ?`)) {
                    try {
                        await customerService.delete(this.customer._id);
                        this.$router.push({ name: "customer" });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            },
        },

        async created() {
            await this.getCustomer();
            this.message = "";
        }
    };
</script>