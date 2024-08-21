<template>
  <!-- Main container with dynamic theme classes -->
  <div :class="['p-4', themeClass]">
    <!-- Header Section with title for discounted products -->
    <h2 :class="headerTextClass">Discounted Products</h2>

    <!-- Conditional rendering for discounted products -->
    <div v-if="discountedProducts.length > 0" class="carousel flex overflow-x-auto space-x-4">
      <!-- Iterate over discounted products to display each one -->
      <div v-for="product in discountedProducts" :key="product.id" class="carousel-item min-w-[250px] flex-shrink-0">
        <!-- Product link with dynamic URL and click handler -->
        <a
          :href="`/#/about?id=${product.id}&sortPrice=${sortPrice}&sortType=${sortType}&userId=${userId}`"
          class="block p-4 rounded-lg shadow-md"
          :class="classHover"
          @click="handleProductClick(product)"
        >
          <!-- Product image -->
          <img :src="product.image" :alt="product.title" class="w-full max-h-[20vw] object-contain mb-4">
          
          <!-- Product details -->
          <div class="text-center">
            <!-- Product title -->
            <h3 :class="titleTextClass">{{ product.title }}</h3>
            <!-- Discounted price or original price -->
            <p v-if="product.discountedPrice" :class="priceTextClass">${{ product.discountedPrice }}</p>
            <p v-else :class="priceTextClass">${{ product.originalPrice }}</p>
            <!-- Original price with strikethrough -->
            <p v-if="product.discountPercentage" class="text-gray-500 line-through">${{ product.originalPrice }}</p>
            <p v-else class="text-gray-500 line-through">${{ product.originalPrice }}</p>
            <!-- Discount percentage or no discount message -->
            <p v-if="product.discountPercentage" class="text-green-500 text-sm">Discount: {{ product.discountPercentage }}%</p>
            <p v-else class="text-green-500 text-sm">No discount available</p>
            <!-- Sale end date -->
            <p class="text-gray-600 text-xs mt-2">Sale Ends: {{ product.saleEndDate }}</p>
          </div>
        </a>
      </div>
    </div>
    
    <!-- Message when no discounted products are available -->
    <p v-else class="text-gray-500">No discounted products available.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { fetchDiscountedProducts, getDiscountedPriceFromLocalStorage, getDiscountPercentageFromLocalStorage } from './js/ProductDiscount.js';
import { useRouter, useRoute } from 'vue-router';
import useProductList from './js/ProductList.js';

// Refs to manage component state
const discountedProducts = ref([]);
const currentTheme = ref(localStorage.getItem('theme') || 'light');
const router = useRouter();
const route = useRoute();
const userId = ref(0);
const loggedIn = ref(false);
const comparisonList = ref([]);
const sortPrice = ref('');
const sortType = ref('');

// Function to extract numeric ID from URL
const { extractNumericId } = useProductList();

// Fetch data and initialize component on mount
onMounted(async () => {
  // Retrieve userId from local storage or URL query
  const userIdFromStorage = localStorage.getItem('userId');
  const userIdFromUrl = route.query.userId || userIdFromStorage;
  userId.value = extractNumericId(userIdFromUrl);
  
  // Check if user is logged in and retrieve comparison list
  loggedIn.value = localStorage.getItem('loggedIn') === 'true';
  comparisonList.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
  sortPrice.value = route.query.sortPrice || '';
  sortType.value = route.query.sortType || '';

  // Fetch discounted products and update state
  await fetchProductsAndUpdate();

  // Listen for theme changes and update product data
  window.addEventListener('theme-changed', async () => {
    currentTheme.value = localStorage.getItem('theme');
    await fetchProductsAndUpdate();
  });
});

// Function to fetch discounted products and update state
async function fetchProductsAndUpdate() {
  try {
    const products = await fetchDiscountedProducts();
    discountedProducts.value = products.map(product => {
      const discountedPrice = getDiscountedPriceFromLocalStorage(product.id);
      const discountPercentage = getDiscountPercentageFromLocalStorage(product.id);
      return {
        ...product,
        discountedPrice: discountedPrice || product.discountedPrice,
        discountPercentage: discountPercentage || product.discountPercentage
      };
    });
  } catch (error) {
    console.error('Failed to fetch discounted products:', error);
  }
}

// Computed class for theme-based styling
const themeClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
});

// Computed class for hover effect based on theme
const classHover = computed(() => {
  return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
});

// Computed class for header text styling based on theme
const headerTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-300';
});

// Computed class for product title text styling based on theme
const titleTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-300';
});

// Computed class for price text styling based on theme
const priceTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-red-800 text-xl font-bold' : 'text-red-600 text-xl font-bold';
});

// Handle click event for product
function handleProductClick(product) {
  console.log('Product clicked:', product);
  // Implement additional click handling logic if needed
}

// Watch for URL query changes and update sort options
watch(() => route.query, () => {
  sortPrice.value = route.query.sortPrice || '';
  sortType.value = route.query.sortType || '';
}, { immediate: true });
</script>

<style scoped>
/* Custom styling for carousel */
.carousel {
  display: flex;
  overflow-x: auto;
  scrollbar-width: thin;
}

.carousel::-webkit-scrollbar {
  height: 8px;
}

.carousel::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.carousel-item {
  min-width: 250px;
  flex-shrink: 0;
}
</style>
