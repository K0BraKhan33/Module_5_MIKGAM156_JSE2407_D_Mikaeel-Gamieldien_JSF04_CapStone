<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700">Username</label>
          <input id="username" v-model="username" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">Password</label>
          <input id="password" v-model="password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();
const sortPrice = ref('');
const sortType = ref('');

async function handleLogin() {
  try {
    const response = await fetch('https://fakestoreapi.com/users');
    const users = await response.json();

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    // Find the user with matching username and password
    const user = users.find(user => user.username === username.value && user.password === password.value);
    sortPrice.value = urlParams.get('sortPrice') || ''; // Get sorting criteria for price
    sortType.value = urlParams.get('sortType') || ''; // Get sorting criteria for type

            console.log('URL parameters:', { sortPrice: sortPrice.value, sortType: sortType.value });

    if (user) {
      // Format user ID with first 3 letters of first name and surname
      const userId = `${user.id}`;

      // Store user ID in local storage and redirect
      localStorage.setItem('userId', userId);
      router.push(`/products?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    } else {
      alert('Invalid username or password');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
</script>
