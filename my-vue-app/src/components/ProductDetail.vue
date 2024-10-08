<template>
  <!-- Main container with dynamic theme classes -->
  <div :class="themeClass">
    <!-- Header Section -->
    <header :class="[headerClass, 'p-4 flex items-center']">
      <!-- Back link to navigate to the previous page -->
      <a id="backLink" :href="`#/`" :class="headerLinkClass" class="flex items-center space-x-2">
        <!-- Back Arrow Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Site Title -->
        <span :class="headerTextClass">GoodMarting</span>
      </a>
    </header>

    <!-- Main Content -->
    <main class="p-4">
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center h-full">
        <p class="text-[5vw]" :class="headerTextClass">Loading...</p>
      </div>

      <!-- Product Details Section -->
      <div v-else class="border-2 p-4 rounded-lg w-full" :class="[themeClass, 'shadow-md']">
        <!-- Product Title -->
        <h1 class="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-bold mb-0">
          {{ product.title }}
        </h1>

        <!-- Product Image -->
        <img :src="product.image || '/path/to/placeholder-image.png'" alt="Product Image" class="w-full max-h-[50vw] sm:max-h-[35vw] md:max-h-[35vw] lg:max-h-[30vw] object-contain mb-0">

        <!-- Product Price -->
        <div>
          <!-- Discounted Price -->
          <p v-if="product.discountedPrice" class="text-red-500 text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-semibold mb-0">
            Price: ${{ product.discountedPrice }}
          </p>
          <!-- Regular Price -->
          <p v-else class="text-red-500 text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] font-semibold mb-0">
            Price: ${{ product.price || 'N/A' }}
          </p>
          <!-- Original Price with Strikethrough if Discounted -->
          <p v-if="product.discountedPrice" class="text-gray-500 line-through text-[4vw] sm:text-[3vw] md:text-[2vw] lg:text-[1.5vw]">
            Original: ${{ product.price || 'N/A' }}
          </p>
          <!-- Discount Percentage -->
          <p v-if="product.discountPercentage" class="text-green-500 text-[4vw] sm:text-[3vw] md:text-[2vw] lg:text-[1.5vw]">
            Discount: {{ product.discountPercentage }}%
          </p>
          <!-- No Discount Message -->
          <p v-else class="text-green-500 text-[4vw] sm:text-[3vw] md:text-[2vw] lg:text-[1.5vw]">
            No discount available
          </p>
        </div>

        <!-- Product Description -->
        <div class="scroll-box sm:max-h-[60vw] md:max-h-[70vw] lg:max-h-[80vw] border rounded mb-0">
          <p class="text-[4vw] sm:text-[4vw] md:text-[2vw] lg:text-[1.5vw]">
            {{ product.description || 'N/A' }}
          </p>
        </div>

        <!-- Product Category -->
        <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] mb-0">
          Category: {{ product.category || 'N/A' }}
        </p>

        <!-- Product Rating -->
        <div class="flex items-center mb-[50vw]">
          <div class="flex items-center">
            <span class="text-[4vw] lg:text-[3vw] md:text-[2vw] sm:text-[1.5vw]">Rating:</span>
            <div class="flex items-center">
              <!-- Full Star Rating -->
              <template v-if="product.rating && product.rating.rate !== undefined">
                <template v-for="_ in Math.floor(product.rating.rate)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
                <!-- Partial Star Rating -->
                <template v-for="_ in Math.ceil(product.rating.rate - Math.floor(product.rating.rate))">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
                <!-- Empty Stars -->
                <template v-for="_ in 5 - Math.ceil(product.rating.rate)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                  </svg>
                </template>
              </template>
            </div>
          </div>
          <!-- Review Count -->
          <span class="text-[4vw] lg:text-[3vw] md:text-[2vw] sm:text-[1.5vw]">
            {{ product.rating ? `(${product.rating.count} reviews)` : 'No reviews' }}
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useProductDetail } from './js/ProductDetail.js';

export default {
  setup() {
    const { 
      product,
      isFavorited,
      sortPrice,
      sortType,
      loading,
      fetchProductDetail: fetchProductData, 
      init 
    } = useProductDetail();

    // Ref to store the URL of the previous page
    const previousUrl = ref('');

    // Initialize component and set previous URL on mount
    onMounted(() => {
      init();
      previousUrl.value = document.referrer || '/';
    });

    // Function to navigate back to the previous page
    const goBack = () => {
      window.location.href = previousUrl.value;
    };

    // Ref to manage the current theme, default is dark
    const currentTheme = ref(localStorage.getItem('theme') || 'dark');

    // Function to toggle between light and dark themes
    const swapTheme = () => {
      const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark';
      currentTheme.value = newTheme;
      localStorage.setItem('theme', newTheme);
      window.dispatchEvent(new Event('theme-changed'));
    };

    // Computed class for theme-based styling
    const themeClass = computed(() => {
      return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
    });

    // Computed class for header styling based on theme
    const headerClass = computed(() => {
      return currentTheme.value === 'light' ? 'text-[1.75vw] bg-gray-200 text-pink-600' : 'bg-gray-700 text-amber-400';
    });

    // Computed class for header link styling based on theme
    const headerLinkClass = computed(() => {
      return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
    });

    // Computed class for header text styling based on theme
    const headerTextClass = computed(() => {
      return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
    });

    const siteTitle = 'Your Site Title'; // Update with your actual site title

    return {
      product,
      isFavorited,
      loading,
      swapTheme,
      headerClass,
      headerLinkClass,
      sortPrice,
      sortType,
      currentTheme,
      themeClass,
      headerTextClass,
      siteTitle,
      goBack
    };
  }
};
</script>

<style scoped>
/* Custom CSS for scrollable boxes */
.scroll-box {
  overflow-y: auto;
}
</style>
