<template>
  <div :class="[themeClass, 'min-h-screen p-4']">
    <!-- Header Section -->
    <header :class="[headerClass, 'p-4 flex items-center']">
      <a id="backLink" :href="`#/`" :class="headerLinkClass" class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span :class="headerTextClass">GoodMarting</span>
      </a>
    </header>

    <!-- Cart Title -->
    <h2 :class="titleClass">Your Cart</h2>

    <!-- Cart Items List -->
    <ul class="flex flex-wrap gap-4">

      <li v-for="item in cartItems" :key="item.id"
        :class="[itemClass, 'flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 hover:shadow-lg transition-shadow']">
        <a :href="`/#/about?id=${item.id}&sortPrice=${sortPrice}&sortType=${sortType}&userId=${userId}`"
          class="block h-full">
          <div class="flex flex-col h-full">
            <img :src="item.image" :alt="item.title" class="w-full h-48 object-contain mb-4">
            <h2 :class="[itemTitleClass]">{{ item.title }}</h2>
            <p :class="[itemPriceClass]">{{ '$' + (item.price ? item.price.toFixed(2) : 'N/A') }}</p>
            <p :class="[itemQuantityClass]">Quantity: {{ item.quantity }}</p>



          </div>
        </a>
        <input type="number" min="1" :value="item.quantity" @input="updateQuantity(item.id, $event.target.value)"
          :class="[inputClass, 'focus:ring-2 focus:ring-amber-400 transition-ring']" />

        <button @click.prevent="removeFromCart(item.id)"
          :class="[removeButtonClass, 'hover:bg-red-600 transition-colors']">Remove</button>
      </li>

    </ul>


    <!-- Clear Cart Button -->
    <button @click.prevent="clearCart" :class="[clearButtonClass, 'hover:bg-gray-600 transition-colors']">Clear
      Cart</button>

    <!-- Cart Summary -->
    <div class="mt-4">
      <p :class="totalCostClass">Total Cost: ${{ totalCost }}</p>
      <p :class="itemCountClass">Total Items: {{ itemCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useUserCart from './js/UserCart.js';

const { cartItems, totalCost, itemCount, updateCartItem, removeCartItem, clearCart, updateBackLink } = useUserCart();
updateBackLink() 

const currentTheme = ref(localStorage.getItem('theme') || 'light');

onMounted(() => { updateBackLink() })
// Watch for theme change event
window.addEventListener('theme-changed', () => {
  currentTheme.value = localStorage.getItem('theme') || 'light';
});


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
  return currentTheme.value === 'light' ? 'text-[1.75vw] bg-gray-200 text-pink-600' : 'bg-gray-700 text-amber-400';
});

const headerLinkClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const headerTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const titleClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

const itemClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-white border border-gray-300 hover:bg-amber-400' : 'bg-gray-800 border border-gray-600 hover:bg-pink-600';
});

const itemTitleClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const itemPriceClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-400' : 'text-amber-200';
});

const itemQuantityClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const inputClass = computed(() => {
  return currentTheme.value === 'light' ? 'border-gray-300 text-black' : 'border-gray-600 text-black';
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
