import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import ProductList from './components/ProductList.vue';
import ProductDetail from './components/ProductDetail.vue';
import UserLogin from './components/UserLogin.vue';
import UserCart from './components/UserCart.vue';
// import UserWishlist from './components/UserWishlist.vue'; // Assuming you have this component

const routes = [
  { path: '/login', component: UserLogin },
  { path: '/products', component: ProductList },
  { path: '/about', component: ProductDetail, props: true },
  { path: '/cart', component: UserCart },
  // { path: '/wishlist', component: UserWishlist },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
