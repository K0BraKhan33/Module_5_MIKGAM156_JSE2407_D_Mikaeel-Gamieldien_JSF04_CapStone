<template>
  <!-- Main container with dynamic theme class -->
  <div :class="[themeClass, 'min-h-screen p-4']">
    <!-- Header Section with theme-based styling -->
    <header :class="[headerClass, 'p-4 text-[3vw] flex items-center']">
      <a id="backLink" :class="headerLinkClass" class="flex items-center space-x-2" :href="`#`">
        <!-- Back Arrow Icon with dynamic styling -->
        <svg xmlns="http://www.w3.org/2000/svg" :class="['w-6 h-6 ', headerLinkClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Site Title with dynamic text color -->
        <span :class="headerTextClass">GoodMarting</span>
      </a>
    </header>

    <!-- Message displayed when there are no comparison items -->
    <div v-if="comparisonItems.length === 0" :class="emptyMessageClass">
      No products to compare.
    </div>

    <!-- Table displaying comparison items -->
    <div v-else class="overflow-x-auto mt-4">
      <table :class="[tableClass, 'w-full min-w-[600px] border-separate border-spacing-0']">
        <!-- Table Header -->
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" :class="headerCellClass">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Table Rows -->
          <tr v-for="item in comparisonItems" :key="item.id" :class="rowClass">
            <!-- Product Image -->
            <td :class="cellClass">
              <img :src="item.image" :alt="item.title" class="w-full max-w-[100px] h-auto object-contain">
            </td>
            <!-- Product Title -->
            <td :class="cellClass">{{ item.title }}</td>
            <!-- Product Price -->
            <td :class="cellClass">{{ '$' + item.price }}</td>
            <!-- Product Category -->
            <td :class="cellClass">{{ item.category }}</td>
            <!-- Product Rating with star icons -->
            <td :class="cellClass">
              <div class="flex items-center">
                <!-- Filled Star Icons -->
                <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <!-- Half Star Icon -->
                <svg v-if="item.rating.rate % 1 !== 0" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <!-- Empty Star Icons -->
                <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6" :class="emptyStarClass" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
              </div>
            </td>
            <!-- Product Description -->
            <td :class="cellClass">{{ item.description }}</td>
            <!-- Remove Button -->
            <td :class="cellClass">
              <button @click="removeItem(item.id)" :class="removeButtonClass">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useProductList from './js/ProductList';

// Router and route instances
const router = useRouter();
const route = useRoute();

// Reactive state variables
const userId = ref('');
const loggedIn = ref(false);
const sortPrice = ref('');
const sortType = ref('');
const comparisonItems = ref([]);

// Helper function to extract numeric ID
const { extractNumericId } = useProductList();

// Current theme from localStorage or default to 'light'
const currentTheme = ref(localStorage.getItem('theme') || 'light');

// Lifecycle hook for initial setup
onMounted(() => {
  // Retrieve user ID from localStorage or URL query
  const userIdFromStorage = localStorage.getItem('userId');
  const userIdFromUrl = route.query.userId || userIdFromStorage;

  userId.value = extractNumericId(userIdFromUrl);
  loggedIn.value = localStorage.getItem('loggedIn') === 'true';
  sortPrice.value = route.query.sortPrice || '';
  sortType.value = route.query.sortType || '';
  comparisonItems.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
  updateBackLink();  // Update the back link URL
});

/**
 * Updates the back link URL with current sorting parameters.
 */
const updateBackLink = () => {
  const backLink = document.getElementById('backLink');
  if (backLink) {
    // Construct new URL with sorting parameters
    const url = new URL(window.location.href);
    url.hash = `#/products/?sortPrice=${sortPrice.value}&sortType=${sortType.value}`;
    backLink.href = url.toString();  // Set the back link href
  }
};

/**
 * Removes an item from the comparison list and updates localStorage.
 * @param {number} itemId - The ID of the item to remove.
 */
const removeItem = (itemId) => {
  comparisonItems.value = comparisonItems.value.filter(item => item.id !== itemId);
  localStorage.setItem('comparisonList', JSON.stringify(comparisonItems.value));
};

// Computed properties for dynamic theme-based styling
const themeClass = computed(() => currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100');
const headerClass = computed(() => currentTheme.value === 'light' ? 'bg-gray-200 text-pink-300' : 'bg-gray-700 text-amber-600');
const headerLinkClass = computed(() => currentTheme.value === 'light' ? 'text-white' : 'text-amber-400');
const headerTextClass = computed(() => currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400');
const emptyMessageClass = computed(() => currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-200');
const tableClass = computed(() => currentTheme.value === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-200');
const headerCellClass = computed(() => currentTheme.value === 'light' ? 'border border-gray-300 bg-amber-400 text-gray-900' : 'border border-gray-600 bg-amber-500 text-gray-200');
const rowClass = computed(() => currentTheme.value === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-800');
const cellClass = computed(() => currentTheme.value === 'light' ? 'border border-gray-300' : 'border border-gray-600');
const emptyStarClass = computed(() => currentTheme.value === 'light' ? 'text-gray-300' : 'text-gray-500');
const removeButtonClass = computed(() => currentTheme.value === 'light' ? 'bg-red-500 text-white px-2 py-1 rounded' : 'bg-red-700 text-gray-200 px-2 py-1 rounded');

// Table headers
const headers = ['Image', 'Title', 'Price', 'Category', 'Rating', 'Description', 'Remove'];
</script>

<style scoped>
/* Table styles */
table {
  border-collapse: collapse;
}

/* Header and cell styles */
th, td {
  text-align: left;
  padding: 0.5rem;
}

/* Image styles */
td img {
  max-width: 100px;
  max-height: 100px;
}

/* Row styles for alternate coloring */
tr:nth-child(even) {
  background-color: inherit; /* Keep consistent row color */
}

/* Button styles for remove action */
.remove-button {
  background-color: #f56565; /* Light red for light theme */
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.remove-button.dark {
  background-color: #c53030; /* Darker red for dark theme */
}
</style>
