<template>
    <div 
        class="page"
    >
        <h4 class="text-center mt-5">Thêm Nhân viên</h4>
        <EmployeeForm 
            :employee="employee"
            @submit:employee="createEmployee"
        />
    </div>
</template>

<script>
import EmployeeForm from '@/components/Form/EmployeeForm.vue';
import employeeService from '@/services/employee.service';

    export default {
        components: {
            EmployeeForm
        },

        data() {
            return {
                employee: {
                    name: "",
                    password: "",
                    birth: new Date(),
                    role: "",
                    address: "",
                    phone: "",
                },
                message: "",
            };
        },

        methods: {
            async createEmployee(data) {
                try {
                    await employeeService.create(data);
                    alert('Nhân viên đã được tạo thành công.');
                    this.$router.push({ name: "employee" })
                } catch (error) {
                    alert(error);
                }
            },
        },
    }
</script>