import { createApp } from 'vue';
import App from './App.vue';
import store from '../store';

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';

createApp(App).use(router).use(store).mount('#app');
