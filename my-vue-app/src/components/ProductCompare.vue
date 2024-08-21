<template>
  <div :class="[themeClass, 'min-h-screen p-4']">
    <!-- Header Section -->
    <header :class="[headerClass, 'p-4 text-[3vw] flex items-center']">
      <a href="#/products" :class="headerLinkClass" class="flex items-center space-x-2">
        <!-- Back Arrow Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" :class="['w-6 h-6 ', headerLinkClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Site Title -->
        <span :class="headerTextClass">GoodMarting</span>
      </a>
    </header>

    <!-- Empty Message -->
    <div v-if="comparisonItems.length === 0" :class="emptyMessageClass">
      No products to compare.
    </div>

    <!-- Products Table -->
    <div v-else class="overflow-x-auto mt-4">
      <table :class="[tableClass, 'w-full min-w-[600px] border-separate border-spacing-0']">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" :class="headerCellClass">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in comparisonItems" :key="item.id" :class="rowClass">
            <td :class="cellClass">
              <img :src="item.image" :alt="item.title" class="w-full max-w-[100px] h-auto object-contain">
            </td>
            <td :class="cellClass">{{ item.title }}</td>
            <td :class="cellClass">{{ '$' + item.price }}</td>
            <td :class="cellClass">{{ item.category }}</td>
            <td :class="cellClass">
              <div class="flex items-center">
                <!-- Star SVGs for Rating -->
                <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <svg v-if="item.rating.rate % 1 !== 0" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6" :class="emptyStarClass" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
              </div>
            </td>
            <td :class="cellClass">{{ item.description }}</td>
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

const router = useRouter();
const route = useRoute();
const userId = ref('');
const loggedIn = ref(false);
const sortPrice = ref('');
const sortType = ref('');
const comparisonItems = ref([]);
const { extractNumericId } = useProductList();

const currentTheme = ref(localStorage.getItem('theme') || 'light');

onMounted(() => {
  const userIdFromStorage = localStorage.getItem('userId');
  const userIdFromUrl = route.query.userId || userIdFromStorage;

  userId.value = extractNumericId(userIdFromUrl);
  loggedIn.value = localStorage.getItem('loggedIn') === 'true';
  sortPrice.value = route.query.sortPrice || '';
  sortType.value = route.query.sortType || '';
  comparisonItems.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
});

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

const headers = ['Image', 'Title', 'Price', 'Category', 'Rating', 'Description'];
</script>

<style scoped>
table {
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 0.5rem;
}

td img {
  max-width: 100px;
  max-height: 100px;
}

tr:nth-child(even) {
  background-color: inherit; /* Keep consistent row color */
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
