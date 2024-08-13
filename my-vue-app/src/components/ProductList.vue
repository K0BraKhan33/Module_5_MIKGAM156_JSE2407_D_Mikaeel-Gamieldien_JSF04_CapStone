<!--ProductList.vue-->
<template>
  <div class="bg-purple-800 min-h-screen p-4">
    <!-- Header Section -->
    <header class="bg-purple-800 p-4 flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-white text-[4vw] font-bold">GoodMarting</h1>
      </div>
      <!-- Shopping Cart and Wishlist Icons -->
      <div class="flex space-x-4">
        <button 
          @click="handleAuthButtonClick" 
          :class="{'bg-red-500': loggedIn, 'bg-blue-500': !loggedIn}"
          class="text-white p-2 rounded-lg mt-4"
        >
          {{ loggedIn ? 'Sign Out' : 'Login' }}
        </button>
        <button @click="redirectToCart" class="text-white text-[4vw] sm:text-[2vw]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h15l1 10H8L6 6zM4 4h2l3.6 9.6L10.2 16H20v2H8.4l-1.6-2H3V4h1z"/>
          </svg>
          <span class="sr-only">Shopping Cart</span>
        </button>
        <button @click="redirectToWishlist" class="text-white text-[4vw] sm:text-[2vw]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3l1.5 3h3.5l-2.7 2.5L15 12l-3-2-3 2 1-3-2.7-2.5h3.5L12 3zm0 12c2.1 0 4-1.7 4-4s-1.9-4-4-4-4 1.7-4 4 1.9 4 4 4zm0 2c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
          </svg>
          <span class="sr-only">Wishlist</span>
        </button>
        <button @click="goToComparison">Compare Products</button>
      </div>
    </header>

    <!-- Sorting and Filtering -->
    <SortControls
      :sortPrice="sortPrice"
      :sortType="sortType"
      :categories="categories"
      :isDefaultSort="isDefaultSort"
      @update:sortPrice="updateSortPrice"
      @update:sortType="updateSortType"
      @sort-change="handleSortChange"
    />

    <!-- Product List -->
    <div>
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <p class="border-gray-300 text-[5vw]">Loading...</p>
      </div>
      <ul v-else class="flex flex-wrap -mx-4">
        <li v-for="item in filteredItems" :key="item.id" class="flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 min-h-[60vw] sm:min-h-[25vw] md:min-h-[20vw] lg:min-h-[15vw] cursor-pointer">
          <a :href="`/#/about?id=${item.id}&sortPrice=${sortPrice}&sortType=${sortType}&userId=${userId}`" class="block h-full">
            <div class="border-2 border-purple-800 bg-purple-300 p-4 rounded-lg h-full flex flex-col">
              <img :src="item.image" :alt="item.title" class="w-full max-h-[35vw] sm:max-h-[20vw] md:max-h-[30vw] lg:max-h-[25vw] object-contain mb-4">
              <div class="flex flex-col flex-grow">
                <div class="mb-4">
                  <h2 class="font-bold text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]">{{ item.title }}</h2>
                </div>
                <div class="flex flex-col mb-4">
                  <p class="text-gray-700 text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw]">{{ '$' + item.price }}</p>
                  <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mb-0">Category: {{ item.category }}</p>
                  <div class="flex items-center">
                    <span class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mr-2">Rating:</span>
                    <div class="flex items-center">
                      <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                      </svg>
                      <svg v-for="n in Math.ceil(item.rating.rate - Math.floor(item.rating.rate))" :key="`half-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                      </svg>
                      <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          <button @click="toggleComparison(item)" class="mt-auto bg-purple-600 text-white py-2 px-4 rounded">
            {{ isInComparison(item.id) ? 'Remove from Comparison' : 'Add to Comparison' }}
          </button>
          <button @click="addToCart(item)" class="mt-2 bg-purple-600 text-white py-2 px-4 rounded">Add to Cart</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useProductList from './ProductList.js';
import { useRouter } from 'vue-router';
import SortControls from './SortControls.vue';

const { filteredItems, isLoading, sortPrice, sortType, categories, handleSortChange, isDefaultSort } = useProductList();
const router = useRouter();
const userId = ref('');
const loggedIn = ref(false);
const comparisonList = ref([]);

/**
 * Initializes component by retrieving user data and setting up local storage values.
 */
onMounted(() => {
  const prePath = localStorage.getItem('prePath');
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromStorage = localStorage.getItem('userId');
  const userIdFromUrl = urlParams.get('userId') || userIdFromStorage;

  userId.value = extractNumericId(userIdFromUrl);
  loggedIn.value = localStorage.getItem('loggedIn') === 'true';
  comparisonList.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
  localStorage.setItem('prePath', window.location.hash.split('?')[0].split('/')[1]);
});

/**
 * Redirects to the comparison page or login page based on user authentication.
 */
function goToComparison() {
  if (userId.value) {
    router.push('/compare');
  } else {
    router.push('/login');
  }
}

/**
 * Handles login and logout actions based on the user's current state.
 */
function handleAuthButtonClick() {
  if (loggedIn.value) {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('comparisonList');
    localStorage.removeItem('prePath');
    localStorage.setItem('loggedIn', 'false');
    loggedIn.value = false;
  } else {
    localStorage.setItem('loggedIn', 'true');
    router.push('/login?redirect=wishlist');
  }
}

/**
 * Extracts a numeric ID from a string.
 * @param {string} id - The ID to extract.
 * @returns {string} - The extracted numeric ID.
 */
function extractNumericId(id) {
  return id ? id.match(/\d+/)?.[0] || '' : '';
}

/**
 * Redirects to the cart page if the user is logged in.
 */
function redirectToCart() {
  if (loggedIn.value) {
    router.push(`/cart?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
  } else {
    alert('You are not logged in');
  }
}

/**
 * Redirects to the wishlist page or login page based on user authentication.
 */
function redirectToWishlist() {
  if (userId.value) {
    router.push(`/wishlist?userId=${userId.value}`);
  } else {
    router.push('/login?redirect=wishlist');
  }
}

/**
 * Adds an item to the cart.
 * @param {Object} item - The item to add to the cart.
 */
function addToCart(item) {
  console.log('Adding to cart:', item);
}

/**
 * Updates the sorting criteria for price.
 * @param {string} newSortPrice - The new sorting criteria for price.
 */
function updateSortPrice(newSortPrice) {
  sortPrice.value = newSortPrice;
  handleSortChange();
}

/**
 * Updates the sorting criteria for type.
 * @param {string} newSortType - The new sorting criteria for type.
 */
function updateSortType(newSortType) {
  sortType.value = newSortType;
  handleSortChange();
}

/**
 * Toggles the inclusion of an item in the comparison list.
 * @param {Object} item - The item to toggle in the comparison list.
 */
function toggleComparison(item) {
  let comparisonListArray = JSON.parse(localStorage.getItem('comparisonList') || '[]');
  const itemIndex = comparisonListArray.findIndex(i => i.id === item.id);

  if (itemIndex >= 0) {
    comparisonListArray.splice(itemIndex, 1);
  } else {
    if (comparisonListArray.length < 5) { // Limit to 5 products
      comparisonListArray.push(item);
    } else {
      alert('You can compare up to 5 products only.'); // Limit to 5 products
      return;
    }
  }

  localStorage.setItem('comparisonList', JSON.stringify(comparisonListArray));
  comparisonList.value = comparisonListArray; // Update the reactive state
}

/**
 * Checks if an item is in the comparison list.
 * @param {string} itemId - The ID of the item to check.
 * @returns {boolean} - True if the item is in the comparison list, false otherwise.
 */
function isInComparison(itemId) {
  return comparisonList.value.some(item => item.id === itemId);
}
</script>

<style scoped>
/* Add styles if needed */
</style>
