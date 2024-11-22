<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3">
            <h1 class="col-12 d-flex justify-content-center text-info">
                Lịch sử nhập hàng
            </h1>
        </div>

        <div class="col-12 text-center mt-3">
            <ImportTable
                v-if="(filteredImportShipmentsCount > 0)"
                :name=tableName
                :table-headers=tableHeaders
                :table-rows=filteredImportShipments
                :btn-contents=btnContents
                :btn-styles=btnStyles
                @click-btn="goToDetailImportShipment"
            />

            <p v-else-if="(searchText)">
                Không có dữ liệu chứ ký tự "{{ searchText.trim() }}"
            </p>

            <p v-else >
                Không có dữ liệu
            </p>
            
        </div>
    </div>
</template>

<script>
    import ImportShipmentService from '@/services/importShipment.service';
    import InputSearch from '@/components/InputSearch.vue';
    import ImportTable from '@/components/Table.vue';
    import dateUtil from '@/utlis/date.util';

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
                    { name: "Số lượng", key: "quantity" },
                    { name: "Tồn kho", key: "stoke" },
                    { name: "Đơn giá", key: "purchasePrice" },
                    { name: "Thời gian tạo", key: "createdAt" },
                ],
                importShipments: [],
                searchText: "",
                employees: [],
                btnContents: ['<i class="fas fa-eye"></i> Xem chi tiết'],
                btnStyles: ['btn-info'],
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
                    this.importShipments = await ImportShipmentService.getAll(this.$route.params.id);
                    this.importShipments.map((importShipment) => {
                        importShipment.createdAt = dateUtil.getStringDateTime(importShipment.createdAt);
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

            goToDetailImportShipment(id) {
                this.$router.push(
                    {
                        name: "importShipment.detail",
                        params: { id: id }
                    }
                )
            },
        },

        async created() {
            await this.refreshList();
        }
    }
</script>