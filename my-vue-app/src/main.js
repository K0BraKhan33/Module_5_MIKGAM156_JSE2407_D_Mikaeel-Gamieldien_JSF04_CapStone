import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import ProductList from './components/ProductList.vue';
import ProductDetail from './components/ProductDetail.vue';
import loginDetails from './components/UserLogin.vue';
const routes = [
  { path: '/', component: ProductList },
  { path: '/about', component: ProductDetail },
  { path: '/login', component: loginDetails }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

createApp(App).use(router).mount('#app');
