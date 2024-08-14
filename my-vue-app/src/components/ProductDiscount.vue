<template>
    <main class="p-4">
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center h-full">
        <p class="border-gray-300 text-[5vw]">Loading...</p>
      </div>
  
      <!-- Product Details Section -->
      <div v-else class="border-2 border-purple bg-purple-300 shadow-md rounded-lg w-full p-4">
        <h1 class="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-bold mb-0 border-gray-300">
          {{ product.title }}
        </h1>
  
        <img :src="product.image || '/path/to/placeholder-image.png'" alt="Product Image" class="w-full max-h-[50vw] sm:max-h-[35vw] md:max-h-[35vw] lg:max-h-[30vw] object-contain mb-0">
  
        <p class="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-semibold border-gray-300 mb-0">
          Price: ${{ product.price || 'N/A' }}
        </p>
  
        <div class="scroll-box sm:max-h-[60vw] md:max-h-[70vw] lg:max-h-[80vw] border border-purple-dark rounded mb-0">
          <p class="text-[4vw] sm:text-[4vw] md:text-[2vw] lg:text-[1.5vw] border-gray-300">
            {{ product.description || 'N/A' }}
          </p>
        </div>
  
        <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] border-gray-300 mb-0">
          Category: {{ product.category || 'N/A' }}
        </p>
  
        <div class="flex items-center mb-[50vw]">
          <div class="flex items-center">
            <span class="text-[4vw] lg:text-[3vw] md:text-[2vw] sm:text-[1.5vw] border-gray-300 mr-2">Rating:</span>
            <div class="flex items-center">
              <template v-if="product.rating && product.rating.rate !== undefined">
                <template v-for="_ in Math.floor(product.rating.rate)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
                <template v-for="_ in Math.ceil(product.rating.rate - Math.floor(product.rating.rate))">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
                <template v-for="_ in 5 - Math.ceil(product.rating.rate)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
              </template>
            </div>
          </div>
          <span class="text-[4vw] lg:text-[3vw] md:text-[2vw] sm:text-[1.5vw] border-gray-300">
            {{ product.rating ? `(${product.rating.count} reviews)` : 'No reviews' }}
          </span>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import useDiscount from './js/ProductDiscount.js';
  
  const loading = ref(true);
  const product = ref({});
  
  const { getProduct } = useDiscount();
  
  onMounted(async () => {
    const products = await getProduct();
    if (products.length > 0) {
      product.value = products[0];  // Display the first product initially
    }
    loading.value = false;
  });
  </script>
  