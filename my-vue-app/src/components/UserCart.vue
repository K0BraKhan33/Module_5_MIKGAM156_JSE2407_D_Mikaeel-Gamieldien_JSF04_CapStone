<template>
  <div :class="[themeClass, 'min-h-screen p-4']">
    <header :class="[headerClass, 'p-4 flex items-center']">
      <a
        id="backLinkCart"
        :href="backUrl"
        class="text-white text-lg font-semibold flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-lg">GoodMarting</span>
      </a>
    </header>

    <h2 :class="titleClass">Your Cart</h2>

    <ul class="flex flex-wrap gap-4">
      <li v-for="item in cartItems" :key="item.id"
          :class="[itemClass, 'flex flex-col w-full md:w-1/2 lg:w-1/4 p-4']">
        <div class="flex flex-col h-full">
          <img :src="item.image" :alt="item.title"
              class="w-full h-48 object-contain mb-4">
          <h2 :class="itemTitleClass">{{ item.title }}</h2>
          <p :class="itemPriceClass">{{ '$' + (item.price ? item.price.toFixed(2) : 'N/A') }}</p>
          <p :class="itemQuantityClass">Quantity: {{ item.quantity }}</p>

          <input type="number" min="1" :value="item.quantity" @input="updateQuantity(item.id, $event.target.value)"
              :class="inputClass" />

          <button @click.prevent="removeFromCart(item.id)"
              :class="removeButtonClass">Remove</button>
        </div>
      </li>
    </ul>

    <button @click.prevent="clearCart" :class="clearButtonClass">Clear Cart</button>

    <div class="mt-4">
      <p :class="totalCostClass">Total Cost: ${{ totalCost }}</p>
      <p :class="itemCountClass">Total Items: {{ itemCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useUserCart from './js/UserCart.js';

const { cartItems, totalCost, itemCount, updateCartItem, removeCartItem, clearCart } = useUserCart();

const currentTheme = ref(localStorage.getItem('theme') || 'light');

// Watch for theme change event
window.addEventListener('theme-changed', () => {
  currentTheme.value = localStorage.getItem('theme') || 'light';
});

const getBackUrl = () => {
  const prePath = localStorage.getItem('prePath');
  return !prePath || prePath === 'cart' ? '/#/products' : `/#/${prePath}`;
};

const backUrl = getBackUrl();

const updateQuantity = (productId, quantity) => {
  updateCartItem(productId, parseInt(quantity, 10));
};

const removeFromCart = (productId) => {
  removeCartItem(productId);
};

const themeClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
});

const headerClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-800' : 'bg-gray-700';
});

const titleClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

const itemClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-800 border border-gray-700';
});

const itemTitleClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-200';
});

const itemPriceClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-600' : 'text-gray-400';
});

const itemQuantityClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-700' : 'text-gray-300';
});

const inputClass = computed(() => {
  return currentTheme.value === 'light' ? 'border-gray-300' : 'border-gray-600';
});

const removeButtonClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-red-500 text-white' : 'bg-red-700 text-white';
});

const clearButtonClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-white';
});

const totalCostClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-100';
});

const itemCountClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-100';
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
