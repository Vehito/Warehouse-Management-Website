<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText" />
        </div>

        <div class="col-12 text-center mt-3">
            <ImportTable
                v-if="(filteredImportShipmentsCount > 0)"
                :name=tableName
                :table-headers=tableHeaders
                :table-rows=filteredImportShipments
                :btnContents=btnContents
                :btn-styles=btnStyles
                @click-btn="goToDetailImportShipment"
            />

            <p v-else-if="(searchText)">
                Không có sản phẩm chứ ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else >
                Không có sản phẩm
            </p>

            <button class="btn btn-sm btn-success" @click="goToCreateImportShipment">
                Thêm mới
            </button>
            
        </div>
    </div>
</template>

<script>
    import ImportShipmentService from '@/services/importShipment.service';
    import InputSearch from '@/components/InputSearch.vue';
    import ImportTable from '@/components/Table.vue';
    import dateUtil from '@/utlis/date.util';
    import employeeService from '@/services/employee.service';

    export default {
        components: {
            InputSearch,
            ImportTable
        },

        data() {
            return {
                tableName: "Bảng lô hàng nhập",
                tableHeaders: [
                    { name: "Mã lô hàng", key: "id" },
                    { name: "Nhà cung cấp", key: "supplier" },
                    { name: "Thời gian tạo", key: "createdAt" },
                    { name: "Người tạo", key: "createdBy" },
                    { name: "Tổng giá trị", key: "total" }
                ],
                importShipments: [],
                btnContents: ['<i class="fas fa-eye"></i> Xem chi tiết'],
                btnStyles: ['btn-info'],
                searchText: "",
                employees: [],
            }
        },

        computed: {
            importShipmentStrings() {
                return this.importShipments.map((importShipment) => {
                    const { _id, supplier, createdAt, createdBy } = importShipment;
                    return [_id, supplier, createdAt, createdBy].join("");
                })
            },

            filteredImportShipments() {
                if(!this.searchText) return this.importShipments;
                return this.importShipments.filter((_importShipment, index) => {
                    return this.importShipmentStrings[index].includes(this.searchText.trim())
                });
            },

            filteredImportShipmentsCount() {
                return this.filteredImportShipments.length;
            },
        },

        methods: {
            async retrieveImportShipments() {
                try {
                    this.importShipments = await ImportShipmentService.getAll();
                    this.importShipments.map((importShipment) => {
                        importShipment.createdAt = dateUtil.getStringDateTime(importShipment.createdAt);
                        const employee = this.employees.find((employee) => employee._id === importShipment.createdBy);
                        if(employee) {
                            importShipment.createdBy = employee.name;
                        }
                    })
                }
                catch (error) {
                    alert(error.message);
                }
            },

            async refreshList() {
                await this.retrieveImportShipments();
                this.searchText = "";
            },

            async retrieveCustomers() {
                try {
                    this.employees = await employeeService.getAll();
                } catch (error) {
                    alert(error.message);
                }
            },

            goToDetailImportShipment(id) {
                this.$router.push(
                    {
                        name: "importShipment.detail",
                        params: { id: id }
                    }
                )
            },

            goToCreateImportShipment() {
                this.$router.push(
                    {
                        name: "importShipment.create",
                    },
                );
            },
        },

        async created() {
            await this.retrieveCustomers();
            await this.refreshList();
        }
    }
</script>