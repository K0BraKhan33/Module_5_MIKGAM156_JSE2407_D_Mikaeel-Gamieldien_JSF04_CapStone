<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <header class="bg-gray-800 p-4 flex items-center">
      <a href="#/products" class="text-white text-lg sm:text-xl md:text-2xl font-bold flex items-center space-x-2">
        <!-- Back Arrow Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Site Title -->
        <span>GoodMarting</span>
      </a>
    </header>

    <div v-if="comparisonItems.length === 0" class="text-gray-800 text-lg sm:text-xl md:text-2xl text-center mt-4">
      No products to compare.
    </div>

    <div v-else class="overflow-x-auto mt-4">
      <table class="w-full min-w-[600px] bg-white text-gray-800 border-separate border-spacing-0">
        <thead>
          <tr>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Image</th>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Title</th>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Price</th>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Category</th>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Rating</th>
            <th class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 bg-amber-400 text-gray-900">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in comparisonItems" :key="item.id" class="bg-gray-50 hover:bg-gray-100">
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
              <img :src="item.image" :alt="item.title" class="w-16 h-16 object-contain">
            </td>
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">{{ item.title }}</td>
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">{{ '$' + item.price }}</td>
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">{{ item.category }}</td>
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
              <div class="flex items-center">
                <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <svg v-for="n in Math.ceil(item.rating.rate - Math.floor(item.rating.rate))" :key="`half-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
                <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z"/>
                </svg>
              </div>
            </td>
            <td class="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">{{ item.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const comparisonItems = ref([]);
const router = useRouter();

onMounted(() => {
  const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
  comparisonItems.value = comparisonList;
});

function goBack() {
  router.push('/products');
}
</script>

<style scoped>
/* Additional styles to enhance appearance if needed */
table {
  border-collapse: collapse;
}

th, td {
  text-align: left;
}

td img {
  max-width: 100px;
  max-height: 100px;
}

th {
  background-color: #fbbf24; /* bg-amber-400 */
  color: #1f2937; /* text-gray-900 */
}

tr:nth-child(even) {
  background-color: #f9fafb; /* bg-gray-50 */
}
</style>
