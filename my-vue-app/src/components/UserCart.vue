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
        <a 
          @click.prevent="navigateToAbout(item.id)" 
          href="#" 
          class="block h-full"
        >
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

const currentTheme = ref(localStorage.getItem('theme') || 'light');

// Define sorting parameters (These should be dynamically updated by your sorting logic)
const sortPrice = ref('priceDesc'); // Example: 'priceAsc', 'priceDesc'
const sortType = ref("men's clothing"); // Example: 'category'

onMounted(() => {
  updateBackLink();
});

// Watch for theme change event
window.addEventListener('theme-changed', () => {
  currentTheme.value = localStorage.getItem('theme') || 'light';
});

/**
 * Update the quantity of a cart item.
 * @param {number} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity of the product.
 */
const updateQuantity = (productId, quantity) => {
  updateCartItem(productId, parseInt(quantity, 10));
};

/**
 * Remove a product from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
const removeFromCart = (productId) => {
  removeCartItem(productId);
};

/**
 * Navigate to the About page with the product ID and current sorting parameters.
 * @param {number} productId - The ID of the product to navigate to.
 */
const navigateToAbout = (productId) => {
  // Update prePath in local storage
  localStorage.setItem('prePath', 'cart');
  
  // Construct the new URL with the required parameters
  const newUrl = `/#/about?id=${productId}&sortPrice=${sortPrice.value}&sortType=${sortType.value}`;
  
  // Navigate to the new URL
  window.location.href = newUrl;
};

const themeClass = computed(() => {
  /**
   * Compute the class for the main container based on the current theme.
   * @returns {string} - The class for the container.
   */
  return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
});

const headerClass = computed(() => {
  /**
   * Compute the class for the header section based on the current theme.
   * @returns {string} - The class for the header.
   */
  return currentTheme.value === 'light' ? 'text-[1.75vw] bg-gray-200 text-pink-600' : 'bg-gray-700 text-amber-400';
});

const headerLinkClass = computed(() => {
  /**
   * Compute the class for the header link based on the current theme.
   * @returns {string} - The class for the header link.
   */
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const headerTextClass = computed(() => {
  /**
   * Compute the class for the header text based on the current theme.
   * @returns {string} - The class for the header text.
   */
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const titleClass = computed(() => {
  /**
   * Compute the class for the cart title based on the current theme.
   * @returns {string} - The class for the title.
   */
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

const itemClass = computed(() => {
  /**
   * Compute the class for each cart item based on the current theme.
   * @returns {string} - The class for each item.
   */
  return currentTheme.value === 'light' ? 'bg-white border border-gray-300 hover:bg-amber-400' : 'bg-gray-800 border border-gray-600 hover:bg-pink-600';
});

const itemTitleClass = computed(() => {
  /**
   * Compute the class for item titles based on the current theme.
   * @returns {string} - The class for item titles.
   */
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const itemPriceClass = computed(() => {
  /**
   * Compute the class for item prices based on the current theme.
   * @returns {string} - The class for item prices.
   */
  return currentTheme.value === 'light' ? 'text-pink-400' : 'text-amber-200';
});

const itemQuantityClass = computed(() => {
  /**
   * Compute the class for item quantities based on the current theme.
   * @returns {string} - The class for item quantities.
   */
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

const inputClass = computed(() => {
  /**
   * Compute the class for quantity input fields based on the current theme.
   * @returns {string} - The class for the input fields.
   */
  return currentTheme.value === 'light' ? 'border-gray-300 text-black' : 'border-gray-600 text-black';
});

const removeButtonClass = computed(() => {
  /**
   * Compute the class for the remove button based on the current theme.
   * @returns {string} - The class for the remove button.
   */
  return currentTheme.value === 'light' ? 'bg-red-500 text-white' : 'bg-red-700 text-white';
});

const clearButtonClass = computed(() => {
  /**
   * Compute the class for the clear cart button based on the current theme.
   * @returns {string} - The class for the clear cart button.
   */
  return currentTheme.value === 'light' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-white';
});

const totalCostClass = computed(() => {
  /**
   * Compute the class for the total cost display based on the current theme.
   * @returns {string} - The class for the total cost.
   */
  return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-100';
});

const itemCountClass = computed(() => {
  /**
   * Compute the class for the item count display based on the current theme.
   * @returns {string} - The class for the item count.
   */
  return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-100';
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
