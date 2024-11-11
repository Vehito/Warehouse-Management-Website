<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText"/>
        </div>

        <div class="col-12 text-center mt-5">
            <CustomersTable
                v-if="(filteredProductsCount > 0)"
                :name=tableName
                :tableHeaders=tableHeaders
                :btnContent=btnContent
                :tableRows=filteredCustomers
                @clickBtn="goToEditCustomer"
            />

            <p v-else-if="(searchText)">
                Không có khách hàng chứa ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else >
                Không có sản phẩm
            </p>

        </div>

        <div class="mt-3 col-12 d-flex justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>

                <button class="btn btn-sm btn-success" @click="goToCreateProduct">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>

        </div>
        
    </div>
</template>

<script>
    import customerService from '@/services/customer.service';
    import InputSearch from '@/components/inputSearch.vue';
    import CustomersTable from '@/components/Table.vue';
import dateUtil from '@/utlis/date.util';

    export default {
        components: {
            InputSearch,
            CustomersTable
        },

        data() {
            return {
                tableName: "Bảng khách hàng",
                tableHeaders: [
                    { name: "Mã khách hàng" , key: "_id" },
                    { name: "Tên khách hàng", key: "name"},
                    { name: "Công ty", key: "company" },
                    { name: "Địa chỉ", key: "address"},
                    { name: "Nợ", key: "debt" },
                    { name: "Hạn trả nợ", key: "dueDate" },
                ],
                customers: [],
                searchText: "",
                btnContent: '<i class="fas fa-edit"></i> Thay đổi'
            };
        },

        computed: {
            customerStrings() {
                return this.customers.map((customer) => {
                    const { _id, name, company } = customer;
                    return [_id, name, company].join("");
                })
            },

            filteredCustomers() {
                if(!this.searchText) return this.customers;
                return this.customers.filter((_product, index) => {
                    return this.customerStrings[index].includes(this.searchText.trim())
                });
            },

            filteredProductsCount() {
                return this.filteredCustomers.length;
            },
        },

        methods: {
            async retrieveCustomers() {
                try {
                    this.customers = await customerService.getAll();
                    this.customers.map((customer) => {
                        customer.dueDate = dateUtil.getStringDate(customer.dueDate);
                    })
                }
                catch (error) {
                    alert(error.message);
                }
            },

            async refreshList() {
                await this.retrieveCustomers();
                this.searchText = "";
            },

            goToEditCustomer(id) {
                this.$router.push(
                    { 
                        name: "customer.edit",
                        params: { id: id }
                    },
                );
            },

            goToCreateProduct() {
                this.$router.push(
                    {
                        name: "customer.create",
                    },
                );
            },
        },

        async mounted() {
            await this.refreshList();
        }

    };
</script>