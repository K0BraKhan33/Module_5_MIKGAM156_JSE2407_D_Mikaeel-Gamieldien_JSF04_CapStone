<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
        
        <!-- Username Field -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
          <input v-model="username" type="text" id="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your username">
        </div>
  
        <!-- Password Field with Toggle Visibility -->
        <div class="mb-6 relative">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password">
          <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg :class="{'text-gray-600': showPassword, 'text-gray-400': !showPassword}" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12l-2 2m0 0l-2-2m2 2V7m2 6a7.016 7.016 0 01-7.5 7 7 7 0 010-14c3.866 0 7 3.134 7 7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l-2-2m2 2l2-2m-2 2v7m0-10a7 7 0 110-14c3.866 0 7 3.134 7 7 0 1.53-.51 3.06-1.5 4.5M4.5 12.5A7.016 7.016 0 0112 5a7 7 0 015.5 11" />
            </svg>
          </button>
        </div>
  
        <!-- Login Button -->
        <div class="flex items-center justify-between">
          <button @click="handleLogin" :disabled="!canSubmit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" :class="{'opacity-50': !canSubmit}" type="button">
            Login
          </button>
        </div>
  
        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center mt-4 text-blue-500">Logging in...</div>
  
        <!-- Error Message -->
        <div v-if="error" class="text-center mt-4 text-red-500">{{ error }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue';
  
  export default {
    setup() {
      const username = ref('');
      const password = ref('');
      const showPassword = ref(false);
      const loading = ref(false);
      const error = ref(null);
  
      const canSubmit = computed(() => username.value && password.value);
  
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
  
      const handleLogin = async () => {
        if (!canSubmit.value) return;
        loading.value = true;
        error.value = null;
  
        try {
          const response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              username: username.value,
              password: password.value
            })
          });
  
          if (!response.ok) {
            throw new Error('Login failed');
          }
  
          const data = await response.json();
          localStorage.setItem('token', data.token);
  
          // Redirect to the previous page or default page after successful login
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          window.location.href = redirectUrl;
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
      return {
        username,
        password,
        showPassword,
        loading,
        error,
        canSubmit,
        togglePasswordVisibility,
        handleLogin
      };
    }
  };
  </script>
  
  <style scoped>
  /* Your custom styles here */
  </style>
  