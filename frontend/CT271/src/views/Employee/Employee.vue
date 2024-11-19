<template>
    <div class="page row">
        <div class="col-12 d-flex justify-content-center">
            <InputSearch v-model="searchText" />
        </div>
        <div class="col-md-7 mt-5 d-flex flex-column align-items-center">
            <div class="col-md-6 text-center">
                <h4>
                    Nhân viên
                    <i class="fa-solid fa-user"></i>
                </h4>
                <EmployeeList 
                    v-if="filteredEmployeeCount > 0"
                    :items="filteredEmployees"
                    v-model:active-index="activeIndex"
                />
                <p v-else>Không có nhân viên nào.</p>
            </div>

            <div class="mt-3 d-flex justify-content-between align-items-center">
                <button 
                    class="btn btn-primary"
                    @click="refreshList"
                >
                    <i class="fas -fa-rotate-right"></i> Làm mới
                </button>

                <button 
                    class="btn btn-success ml-5"
                    @click="goToAddEmployee"
                >
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
            </div>

        </div>
        
        <div class="mt-5 col-md-5">
            <div v-if="activeIndex > -1">
                <h4>
                    Thông tin nhân viên
                    <i class="fas fa-address-card"></i>
                </h4>
                <EmployeeCard :person="activeReader" />

                <RouterLink
                    :to="{
                        name: 'employee.edit',
                        params: { id: filteredEmployees[activeIndex]._id },
                        // props: { id: filteredEmployees[activeIndex]._id }
                    }"
                >
                    <span class="badge badge-warning mt-2">
                        <i class="fas fa-edit"></i> Hiệu chỉnh
                    </span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import EmployeeCard from '@/components/Card.vue';
import InputSearch from '@/components/InputSearch.vue';
import EmployeeList from '@/components/List.vue';
import employeeService from '@/services/employee.service';
import dateUtil from '@/utlis/date.util';

    export default {
        components: {
            EmployeeCard,
            InputSearch,
            EmployeeList
        },

        data() {
            return {
                employees: [],
                activeIndex: -1,
                searchText: ""
            }
        },

        watch: {
            searchText() {
                this.activeIndex = -1;
            }
        },

        computed: {
            employeeString() {
                return this.employees.map((reader) => {
                    const { name, role } = reader;
                    return [ name, role ].join("");
                });
            },

            filteredEmployees() {
                if(!this.searchText) return this.employees;
                return this.employees.filter((_reader, index) => {
                    return this.employeeString[index].includes(this.searchText);
                })
            },

            activeReader() {
                if(this.activeIndex < 0) return null;
                return [
                    { key: "ID", value: this.filteredEmployees[this.activeIndex]._id },
                    { key: "Họ tên", value: this.filteredEmployees[this.activeIndex].name },
                    { key: "Chức vụ", value: this.filteredEmployees[this.activeIndex].role },
                    { key: "Địa chỉ", value: this.filteredEmployees[this.activeIndex].address },
                    { key: "Ngày sinh", value: dateUtil.getStringDate(this.filteredEmployees[this.activeIndex].birth) },
                    { key: "Điện thoại", value: this.filteredEmployees[this.activeIndex].phone }
                ]
            },

            filteredEmployeeCount() {
                return this.filteredEmployees.length;
            }
        },

        methods: {
            async retrieveEmployees() {
                try {
                    this.employees = await employeeService.getAll();
                    this.employees.map((employee) => {
                        employee.name = employee.name;
                    });
                } catch (error) {
                    alert(error);
                }
            },

            async refreshList() {
                await this.retrieveEmployees();
                this.searchText = "";
                this.activeIndex = -1;
            },

            goToAddEmployee() {
                this.$router.push({
                    name: "employee.create"
                });
            },
        },

        async created() {
            await this.refreshList();
        },
    };
</script>

<style scoped>
    .page {
        text-align: left;
        max-width: 900px
    }
</style>