<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText" />
        </div>

        <div class="col-12 text-center mt-3">
            <ExportTable
                v-if="(filteredExportShipmentsCount > 0)"
                :name=tableName
                :table-headers=tableHeaders
                :table-rows=filteredExportShipments
                :btnContents=btnContents
                :btn-styles=btnStyles
                @click-btn="goToDetailExportShipment"
            />

            <p v-else-if="(searchText)">
                Không có dữ liệu chứa ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else >
                Không có sản phẩm
            </p>

            <button class="btn btn-sm btn-success" @click="goToCreateExportShipment">
                Thêm mới
            </button>
            
        </div>
    </div>
</template>

<script>
    import ExportShipmentService from '@/services/exportShipment.service';
    import customerService from '@/services/customer.service';
    import employeeService from '@/services/employee.service';
    import InputSearch from '@/components/InputSearch.vue';
    import ExportTable from '@/components/Table.vue';
    import dateUtil from '@/utlis/date.util';

    export default {
        components: {
            InputSearch,
            ExportTable
        },

        data() {
            return {
                tableName: "Bảng lô hàng nhập",
                tableHeaders: [
                    { name: "Mã lô hàng", key: "id" },
                    { name: "Khách hàng", key: "customer" },
                    { name: "Thời gian tạo", key: "createdAt" },
                    { name: "Người tạo", key: "employee" },
                    { name: "Tổng giá trị", key: "total" }
                ],
                exportShipments: [],
                btnContents: ['<i class="fas fa-eye"></i> Xem chi tiết'],
                btnStyles: ['btn-info'],
                searchText: "",
                customers: [],
                employees: [],
            }
        },

        computed: {
            exportShipmentStrings() {
                return this.exportShipments.map((exportShipment) => {
                    const { _id, customer, createdAt, employee } = exportShipment;
                    return [_id, customer, createdAt, employee ].join("");
                })
            },

            filteredExportShipments() {
                if(!this.searchText) return this.exportShipments;
                return this.exportShipments.filter((_importShipment, index) => {
                    return this.exportShipmentStrings[index].includes(this.searchText.trim())
                });
            },

            filteredExportShipmentsCount() {
                return this.filteredExportShipments.length;
            },
        },

        methods: {
            async retrieveExportShipments() {
                try {
                    this.exportShipments = await ExportShipmentService.getAll();
                    this.exportShipments.map((exportShipment) => {
                        exportShipment.createdAt = dateUtil.getStringDateTime(exportShipment.createdAt);
                        const employee = this.employees.find((employee) => employee._id === exportShipment.createdBy);
                        if(employee) {
                            exportShipment.employee = employee.name;
                        }
                        const customer = this.customers.find((customer) => customer._id === exportShipment.customerId);
                        if(customer) {
                            exportShipment.customer = customer.name;
                        }
                        else {
                            exportShipment.customer = "";
                        }
                    })
                }
                catch (error) {
                    alert(error.message);
                }
            },

            async retrieveCustomers() {
                try {
                    this.customers = await customerService.getAll();
                } catch (error) {
                    alert(error.message);
                }
            },
            
            async retrieveEmployees() {
                try {
                    this.employees = await employeeService.getAll();
                } catch (error) {
                    alert(error.message);
                }
            },

            async refreshList() {
                await this.retrieveCustomers();
                await this.retrieveEmployees();
                await this.retrieveExportShipments();
                this.searchText = "";
            },

            goToDetailExportShipment(id) {
                this.$router.push(
                    {
                        name: "exportShipment.detail",
                        params: { id: id }
                    }
                )
            },

            goToCreateExportShipment() {
                this.$router.push(
                    {
                        name: "exportShipment.create",
                    },
                );
            },
        },

        async created() {
            await this.refreshList();
        }
    }
</script>