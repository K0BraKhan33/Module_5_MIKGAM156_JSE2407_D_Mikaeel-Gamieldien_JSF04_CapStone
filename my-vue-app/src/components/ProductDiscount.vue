<template>
  <div class="bg-gray-100 p-4">
    <h2 class="text-2xl font-bold mb-4">Discounted Products</h2>
    <div v-if="discountedProducts.length > 0" class="carousel flex overflow-x-auto space-x-4">
      <div v-for="product in discountedProducts" :key="product.id" class="carousel-item min-w-[250px] flex-shrink-0">
        <a
          :href="`#/about?id=${product.id}`"
          class="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
          @click="handleProductClick(product)"
        >
          <img :src="product.image" :alt="product.title" class="w-full h-40 object-cover mb-4 rounded-md">
          <div class="text-center">
            <h3 class="text-lg font-semibold">{{ product.title }}</h3>
            <p v-if="product.discountedPrice" class="text-red-500 text-xl font-bold">${{ product.discountedPrice }}</p>
            <p v-else class="text-red-500 text-xl font-bold">${{ product.originalPrice }}</p>
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
import { ref, onMounted } from 'vue';
import { fetchDiscountedProducts, getDiscountedPriceFromLocalStorage, getDiscountPercentageFromLocalStorage } from './js/ProductDiscount.js';

const discountedProducts = ref([]);

// Fetch discounted products when component is mounted
onMounted(async () => {
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
});

// Method to handle product clicks
function handleProductClick(product) {
  // Log or perform any action you need when a product is clicked
  console.log('Product clicked:', product);
  // You can also send data to a server or perform other actions here
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
