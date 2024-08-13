<template>
    <div class="bg-purple-800 min-h-screen p-4">
      <header class="bg-purple-800 p-4 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-white text-[4vw] font-bold">Product Comparison</h1>
        </div>
        <button @click="goBack" class="bg-purple-600 text-white py-2 px-4 rounded">
          Back to Products
        </button>
      </header>
  
      <div v-if="comparisonItems.length === 0" class="text-white text-[3vw] text-center mt-4">
        No products to compare.
      </div>
  
      <table v-else class="w-full bg-white text-gray-800 mt-4">
        <thead>
          <tr>
            <th class="border px-4 py-2">Image</th>
            <th class="border px-4 py-2">Title</th>
            <th class="border px-4 py-2">Price</th>
            <th class="border px-4 py-2">Category</th>
            <th class="border px-4 py-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in comparisonItems" :key="item.id">
            <td class="border px-4 py-2"><img :src="item.image" :alt="item.title" class="w-16 h-16 object-contain"></td>
            <td class="border px-4 py-2">{{ item.title }}</td>
            <td class="border px-4 py-2">{{ '$' + item.price }}</td>
            <td class="border px-4 py-2">{{ item.category }}</td>
            <td class="border px-4 py-2">
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
            </td>
          </tr>
        </tbody>
      </table>
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
  /* Add styles if needed */
  </style>
  