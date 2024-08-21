<template>
  <div :class="['p-4', themeClass]">
    <h2 :class="headerTextClass">Discounted Products</h2>
    <div v-if="discountedProducts.length > 0" class="carousel flex overflow-x-auto space-x-4">
      <div v-for="product in discountedProducts" :key="product.id" class="carousel-item min-w-[250px] flex-shrink-0">
        <a
          :href="`#/about?id=${product.id}`"
          class="block p-4 rounded-lg shadow-md"
          :class="classHover"
          @click="handleProductClick(product)"
        >
          <img :src="product.image" :alt="product.title" class="w-full max-h-[20vw] object-contain mb-4">
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
import { ref, computed, onMounted } from 'vue';
import { fetchDiscountedProducts, getDiscountedPriceFromLocalStorage, getDiscountPercentageFromLocalStorage } from './js/ProductDiscount.js';

const discountedProducts = ref([]);
const currentTheme = ref(localStorage.getItem('theme') || 'light');

onMounted(async () => {
  await fetchProductsAndUpdate();
  window.addEventListener('theme-changed', async () => {
    currentTheme.value = localStorage.getItem('theme');
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

const classHover = computed(() => {
  return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
})

const headerTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-300';
});

const titleTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-300';
});

const priceTextClass = computed(() => {
  return currentTheme.value === 'light' ? 'text-red-800 text-xl font-bold' : 'text-red-600 text-xl font-bold';
});

function handleProductClick(product) {
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
