<template>
    <nav class="navbar navbar-expand navbar-dark bg-secondary">
        <a href="/" class="navbar-brand">
            Ứng dụng Quản lý kho hàng
        </a>
        <div class="mr-auto navbar-nav">
            <li class="nav-item">
                <router-link :to="{ name: 'products'}" class="nav-link">
                    Sản Phẩm
                </router-link>
                <i class="fas fa-box"></i>
            </li>
        </div>
    </nav>
</template>