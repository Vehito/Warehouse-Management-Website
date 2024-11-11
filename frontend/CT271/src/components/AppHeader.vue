<template>
    <nav class="navbar navbar-expand navbar-dark bg-success">
        <a href="/" class="navbar-brand">
            Ứng dụng Quản lý kho hàng
        </a>
        <div class="mr-auto navbar-nav">
            <li class="nav-item text-center">
                <router-link :to="{ name: 'product'}" class="nav-link">
                    <strong>Sản Phẩm</strong>
                </router-link>
                <i class="fas fa-box "></i>
            </li>

            <li class="nav-item text-center">
                <router-link :to="{ name: 'importShipment'}" class="nav-link">
                    <strong>Nhập hàng</strong>
                </router-link>
                <i class="fas fa-archive"></i>
            </li>

            <li class="nav-item text-center">
                <router-link :to="{ name: 'customer'}" class="nav-link">
                    <strong>Khách hàng</strong>
                </router-link>
                <i class="fas fa-building"></i>
            </li>
        </div>
    </nav>
</template>