<template>
  <div :class="themeClass">
    <!-- Header Section -->
    <header :class="['p-4 flex justify-between items-center', themeClass]">
      <div class="flex items-center">
        <!-- Header Title -->
        <h1 :class="headerTextClass">GoodMarting</h1>
      </div>
      <!-- Shopping Cart and Wishlist Icons -->
      <div class="flex space-x-4 p-4">
        <!-- Authentication Button -->
        <button @click="handleAuthButtonClick" :class="[' p-2 rounded-lg', authButtonClass]">
          {{ loggedIn ? 'Sign Out' : 'Login' }}
        </button>
        <!-- Cart Icon -->
        <button @click="redirectToCart" :class="['text-2xl', iconClass, hoverIconClass]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h15l1 10H8L6 6zM4 4h2l3.6 9.6L10.2 16H20v2H8.4l-1.6-2H3V4h1z" />
          </svg>
        </button>
        <!-- Compare Products Button -->
        <button @click="goToComparison" :class="['text-[1.75vw]', buttonTextClass, hoverButtonClass]">
          Compare Products
        </button>
        <!-- Theme Swap Button -->
        <button @click="swapTheme" :class="['text-[1.75vw]', buttonTextClass, hoverButtonClass]">
          Swap Theme
        </button>
      </div>
    </header>

    <!-- Sorting and Filtering Controls -->
    <SortControls :sortPrice="sortPrice" :sortType="sortType" :categories="categories" :isDefaultSort="isDefaultSort"
      @update:sortPrice="updateSortPrice" @update:sortType="updateSortType" @sort-change="handleSortChange" />

    <!-- Discounted Products -->
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <p class="text-[5vw]">Loading...</p>
    </div>
    <Discount />

    <!-- Product List -->
    <div :class="['border-2', themeListBorderClass, 'p-4']">
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <p class="text-[5vw]">Loading...</p>
      </div>
      <ul v-else class="flex flex-wrap -mx-4">
        <li v-for="item in filteredItems" :key="item.id"
          class="flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 min-h-[60vw] sm:min-h-[25vw] md:min-h-[20vw] lg:min-h-[15vw] cursor-pointer"
          :class="themeClass">
          <!-- Product Link -->
          <a :href="`/#/about?id=${item.id}&sortPrice=${sortPrice}&sortType=${sortType}&userId=${userId}`"
            class="block h-full">
            <!-- Product Card -->
            <div :class="['border p-4 rounded-lg shadow-sm h-full flex flex-col', themeClass, hoverItemClass]">
              <!-- Product Image -->
              <img :src="item.image" :alt="item.title" class="w-full max-h-[35vw] object-contain mb-4">
              <div class="flex flex-col flex-grow">
                <!-- Product Title -->
                <div class="mb-4">
                  <h2 :class="itemTitleClass">{{ item.title }}</h2>
                </div>
                <!-- Product Details -->
                <div class="flex flex-col mb-4">
                  <p :class="itemPriceClass">{{ '$' + item.price }}</p>
                  <p :class="itemCategoryClass">Category: {{ item.category }}</p>
                  <div class="flex items-center">
                    <span :class="itemRatingClass">Rating:</span>
                    <div class="flex items-center">
                      <!-- Star SVGs for Rating (Currently omitted) -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          <!-- Comparison Button -->
          <button @click="toggleComparison(item)"
            :class="['mt-auto py-2 px-4 rounded', themeButtonClass, hoverButtonClass]">
            {{ isInComparison(item.id) ? 'Remove from Comparison' : 'Add to Comparison' }}
          </button>
          <!-- Add to Cart Button -->
          <button @click="addToCart(item.id)" :class="['mt-2 py-2 px-4 rounded', themeButtonClass, hoverButtonClass]">
            Add to Cart
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useProductList from './js/ProductList.js';
import SortControls from './SortControls.vue';
import Discount from './ProductDiscount.vue';
import { useRouter } from 'vue-router';

const {
  filteredItems,
  isLoading,
  sortPrice,
  sortType,
  categories,
  addToCart,
  fetchProducts,
  userId,
  handleSortChange,
  isDefaultSort,
  goToComparison,
  handleAuthButtonClick,
  redirectToCart,
  redirectToWishlist,
  toggleComparison,
  isInComparison,
  updateSortPrice,
  updateSortType,
  loggedIn
} = useProductList();

const currentTheme = ref(localStorage.getItem('theme') || 'light');

/**
 * Swap between light and dark themes and store the current theme in local storage.
 */
const swapTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
  currentTheme.value = newTheme;
  localStorage.setItem('theme', newTheme);

  // Dispatch a custom event to notify other components about the theme change
  window.dispatchEvent(new Event('theme-changed'));
};

// Computed properties for theme-based class bindings
/**
 * Compute the class for the main theme.
 * @returns {string} - The class for the current theme.
 */
const themeClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
});

/**
 * Compute the class for buttons based on the current theme.
 * @returns {string} - The class for the button.
 */
const themeButtonClass = computed(() => {
  return currentTheme.value === 'light'
    ? 'bg-pink-400 border-2 border-pink-600 text-gray-900'
    : 'bg-amber-400 border-2 border-amber-600 text-gray-900';
});

/**
 * Compute the class for header text based on the current theme.
 * @returns {string} - The class for the header text.
 */
const headerTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600 text-[3vw]' : 'text-amber-400 text-[3vw] ';
});

/**
 * Compute the class for button text based on the current theme.
 * @returns {string} - The class for button text.
 */
const buttonTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

/**
 * Compute the class for icons based on the current theme.
 * @returns {string} - The class for icons.
 */
const iconClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

/**
 * Compute the class for authentication buttons based on the current theme.
 * @returns {string} - The class for authentication buttons.
 */
const authButtonClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600 bg-amber-400' : 'text-amber-400 bg-pink-600';
});

/**
 * Compute the class for hover effects on buttons based on the current theme.
 * @returns {string} - The class for hover effects on buttons.
 */
const hoverButtonClass = computed(() => {
  return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
});

/**
 * Compute the class for hover effects on icons based on the current theme.
 * @returns {string} - The class for hover effects on icons.
 */
const hoverIconClass = computed(() => {
  return currentTheme.value === 'light' ? 'hover:text-amber-300 transition' : 'hover:text-pink-600 transition';
});

/**
 * Compute the class for hover effects on product items based on the current theme.
 * @returns {string} - The class for hover effects on product items.
 */
const hoverItemClass = computed(() => {
  return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
});

/**
 * Compute the class for the product list border based on the current theme.
 * @returns {string} - The class for the product list border.
 */
const themeListBorderClass = computed(() => {
  return currentTheme.value === 'light' ? 'border-pink-500' : 'border-amber-500';
});

/**
 * Compute the class for product titles based on the current theme.
 * @returns {string} - The class for product titles.
 */
const itemTitleClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
});

/**
 * Compute the class for product prices based on the current theme.
 * @returns {string} - The class for product prices.
 */
const itemPriceClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

/**
 * Compute the class for product categories based on the current theme.
 * @returns {string} - The class for product categories.
 */
const itemCategoryClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-600' : 'text-gray-300';
});

/**
 * Compute the class for product ratings based on the current theme.
 * @returns {string} - The class for product ratings.
 */
const itemRatingClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-600' : 'text-gray-300';
});

/**
 * Fetch products when the component is mounted.
 */
onMounted(() => {
  localStorage.setItem('prePath', 'products');
  fetchProducts();
});
</script>
