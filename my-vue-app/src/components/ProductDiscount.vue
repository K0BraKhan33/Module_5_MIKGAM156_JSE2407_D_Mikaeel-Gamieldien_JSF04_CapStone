<template>
  <div :class="['p-4', themeClass]">
    <h2 :class="headerTextClass">Discounted Products</h2>
    <div v-if="discountedProducts.length > 0" class="carousel flex overflow-x-auto space-x-4">
      <div v-for="product in discountedProducts" :key="product.id" class="carousel-item min-w-[250px] flex-shrink-0">
        <a
          :href="`#/about?id=${product.id}`"
          class="block p-4 rounded-lg shadow-md hover:bg-gray-50 transition"
          @click="handleProductClick(product)"
        >
          <img :src="product.image" :alt="product.title" class="w-full h-40 object-cover mb-4 rounded-md">
          <div class="text-center">
            <h3 :class="titleTextClass">{{ product.title }}</h3>
            <p v-if="product.discountedPrice" :class="priceTextClass">${{ product.discountedPrice }}</p>
            <p v-else :class="priceTextClass">${{ product.originalPrice }}</p>
            <p v-if="product.discountPercentage" class="text-gray-500 line-through">${{ product.originalPrice }}</p>
            <p v-else class="text-gray-500 line-through">${{ product.originalPrice }}</p>
            <p v-if="product.discountPercentage" class="text-green-500 text-sm">Discount: {{ product.discountPercentage }}%</p>
            <p v-else class="text-green-500 text-sm">No discount available</p>
            <p class="text-gray-600 text-xs mt-2">Sale Ends: {{ product.saleEndDate }}</p>
          </div>
        </a>
      </div>
    </div>
    <p v-else class="text-gray-500">No discounted products available.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { fetchDiscountedProducts, getDiscountedPriceFromLocalStorage, getDiscountPercentageFromLocalStorage } from './js/ProductDiscount.js';

const discountedProducts = ref([]);
const currentTheme = ref(localStorage.getItem('theme') || 'dark');

onMounted(async () => {
  // Fetch products initially
  await fetchProductsAndUpdate();
  
  // Listen for theme change events
  window.addEventListener('theme-changed', async () => {
    currentTheme.value = localStorage.getItem('theme') || 'dark';
    await fetchProductsAndUpdate();
  });
});

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

const themeClass = computed(() => {
  return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
});

const headerTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

const titleTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
});

const priceTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-red-800 text-xl font-bold' : 'text-red-600 text-xl font-bold';
});

function handleProductClick(product) {
  // Log or perform any action you need when a product is clicked
  console.log('Product clicked:', product);
}
</script>

<style scoped>
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
