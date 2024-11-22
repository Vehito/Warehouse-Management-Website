<template>
    <div 
        class="page"
        v-if="employee"
    >
        <h4 class="text-center mt-5">Hiệu chỉnh Nhân viên</h4>
        <EmployeeForm 
            :employee="employee"
            @submit:employee="updateEmployee"
            @delete:employee="deleteEmployee"
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

        props: {
            id: { type: String, required: true }
        },

        data() {
            return {
                employee: null,
                message: "",
            };
        },

        methods: {
            async getEmployee(id) {
                try {
                    this.employee = await employeeService.get(id);
                } catch (error) {
                    console.log(error);

                    this.$router.push({
                        name: "notfound",
                        params: {
                            pathMatch: this.$route.path.split("/").slice(1)
                        },
                        query: this.$route.query,
                        hash: this.$route.hash
                    });
                }
            },

            async updateEmployee(data) {
                try {
                    await employeeService.update(this.id, data);
                    alert('Nhân viên đã được cập nhật thành công.');
                    this.$router.back();
                } catch (error) {
                    alert(error);
                }
            },

            async deleteEmployee() {
                try {
                    await employeeService.delete(this.id);
                    this.$router.push({ name: "employee" });
                } catch (error) {
                    console.log(error);
                }
            },
        },

        async created() {
            await this.getEmployee(this.id);
            this.message = "";
        }
    }
</script>