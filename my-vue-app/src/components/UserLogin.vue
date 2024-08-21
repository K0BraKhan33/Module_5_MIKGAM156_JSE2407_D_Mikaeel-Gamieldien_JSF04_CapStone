<template>
  <!-- Main container for the login page -->
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <!-- Login form container with centered alignment -->
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <!-- Login heading -->
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      
      <!-- Login form with submit event handler -->
      <form @submit.prevent="handleLogin">
        <!-- Username input field -->
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

        <!-- Password input field with visibility toggle -->
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
              <!-- Toggle button text based on password visibility -->
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Submit button with loading state -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
          :disabled="loading"
        >
          <!-- Button text based on loading state -->
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <!-- Display error message if login fails -->
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Define reactive state variables
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();

/**
 * Toggles the visibility of the password field.
 */
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

/**
 * Handles the login form submission.
 * Sends login request, processes response, and manages navigation.
 */
async function handleLogin() {
  loading.value = true;  // Show loading indicator
  errorMessage.value = '';  // Clear any previous error messages

  try {
    // Perform the login request
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

    // Check if login was successful
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const { token } = await loginResponse.json();

    if (token) {
      // Fetch user data using the provided token
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
            return `/${prePath}`;  // Return the previous path if available
          } else {
            return '/products';  // Default path if no previous path
          }
        }

        // Get sorting parameters from the URL
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const sortPrice = urlParams.get('sortPrice') || '';
        const sortType = urlParams.get('sortType') || '';

        // Redirect to the appropriate page with sorting parameters
        router.push({
          path: getBackUrl(),
          query: {
            sortPrice: sortPrice,
            sortType: sortType
          }
        });
      } else {
        // Handle case where user is not found
        errorMessage.value = 'User not found';
      }
    } else {
      // Handle case where token is not returned
      errorMessage.value = 'Invalid username or password';
    }
  } catch (error) {
    // Handle and display any errors during login
    errorMessage.value = 'Login failed. Please try again.';
    console.error('Error during login:', error);
  } finally {
    loading.value = false;  // Hide loading indicator
  }
}
</script>
