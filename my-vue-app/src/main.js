import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import ProductList from './components/ProductList.vue';
import ProductDetail from './components/ProductDetail.vue';
import UserLogin from './components/UserLogin.vue';
import UserCart from './components/UserCart.vue';
import ProductCompare from './components/ProductCompare.vue'; // Import the new component

const routes = [
  { path: '/login', component: UserLogin },
  { path: '/products', component: ProductList },
  { path: '/about', component: ProductDetail, props: true },
  { path: '/cart', component: UserCart },
  { path: '/compare', component: ProductCompare }, // Add the comparison route
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
