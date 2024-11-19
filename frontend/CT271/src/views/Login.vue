<template>
    <div 
        class="page"
    >
        <h4 class="text-center mt-5">Đăng Nhập</h4>
        <LoginForm
            :account="account"
            @submit:login="login"
        />
    </div>
</template>

<script>
import LoginForm from '@/components/Form/LoginForm.vue';
import authService from '@/services/auth.service';

    export default {
        components: {
            LoginForm
        },

        data() {
            return {
                account: {
                    username: "",
                    password: "",
                },
                message: "",
            };
        },

        methods: {
            async login(data) {
                try {
                    const auth = await authService.login(data);
                    this.storeUser(auth.user);
                    alert('Đăng nhập thành công.');
                    this.$router.push({ name: "product" })
                } catch (error) {
                    alert(error);
                }
            },

            storeUser(user) {
                this.$store.dispatch('login', user);
            }
        },

        created() {
            this.message = "";
        }
    }
</script>

<style>
@import "../assets/form.css";
.form-control,
.form-group {
    width: 700px
}
</style>