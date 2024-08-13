<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const sortPrice = ref('');
const sortType = ref('');

// Function to toggle password visibility
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// Function to handle login
async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';

  try {
    // Perform the login using fetch
    const loginResponse = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const { token } = await loginResponse.json();

    if (token) {
      // Fetch the user data
      const usersResponse = await fetch('https://fakestoreapi.com/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const users = await usersResponse.json();
      const user = users.find(user => user.username === username.value);
      if (user) {
        const userId = `${user.id}`;

        // Store the JWT and user ID in local storage
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);

        // Function to get the previous page URL
        function getBackUrl() {
          const prePath = localStorage.getItem('prePath');
          const currentPath = window.location.hash.split('?')[0];

          if (prePath) {
            return `/${prePath}`;  // Ensure prePath is returned correctly
          } else {
            return '/products';  // Default path
          }
        }

        // Get sorting parameters
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        sortPrice.value = urlParams.get('sortPrice') || '';
        sortType.value = urlParams.get('sortType') || '';

        // Redirect to products page with sorting parameters
        router.push({
          path: getBackUrl(),
          query: {
            sortPrice: sortPrice.value,
            sortType: sortType.value
          }
        });
      } else {
        errorMessage.value = 'User not found';
      }
    } else {
      errorMessage.value = 'Invalid username or password';
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.';
    console.error('Error during login:', error);
  } finally {
    loading.value = false;
  }
}
</script>
