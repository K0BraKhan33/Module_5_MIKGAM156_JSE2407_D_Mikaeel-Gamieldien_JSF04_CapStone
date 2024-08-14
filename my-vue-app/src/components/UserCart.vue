<template>
  <div>
    <header class="bg-purple-800 p-4 flex items-center">
      <a
        id="backLinkCart"
        :href="backUrl"
        class="text-white text-[4vw] font-bold flex items-center space-x-2"
      >
        <!-- Back Arrow Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Site Title -->
        <span>GoodMarting</span>
      </a>
    </header>
    <h2>Your Cart</h2>
    <ul class="flex flex-wrap">
      <li v-for="item in cartItems" :key="item.id"
          class="flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 min-h-[60vw] sm:min-h-[25vw] md:min-h-[20vw] lg:min-h-[15vw] cursor-pointer">
        <a :href="`/#/about?id=${item.id}&sortPrice=${sortPrice}&sortType=${sortType}`"
            class="block h-full">
          <div class="border-2 border-purple-800 bg-purple-300 p-4 rounded-lg h-full flex flex-col">
            <img :src="item.image" :alt="item.title"
                class="w-full max-h-[35vw] sm:max-h-[20vw] md:max-h-[30vw] lg:max-h-[25vw] object-contain mb-4">
            <div class="flex flex-col flex-grow">
              <div class="mb-4">
                <h2 class="font-bold text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]">{{ item.title }}</h2>
              </div>
              <div class="flex flex-col mb-4">
                <p class="text-gray-700 text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw]">{{ '$' + item.price.toFixed(2) }}</p>
                <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mb-0">
                  Quantity: {{ getItemQuantity(item.id) }}</p>
                <div class="flex items-center">
                  <span class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mr-2">Rating:</span>
                  <div class="flex items-center">
                    <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`"
                        xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500"
                        fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                    </svg>
                    <svg v-for="n in Math.ceil(item.rating.rate - Math.floor(item.rating.rate))" :key="`half-${n}`"
                        xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500" fill="currentColor"
                        viewBox="0 0 24 24">
                      <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                    </svg>
                    <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`"
                        xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300"
                        fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <button @click.prevent="removeFromCart(item.id)"
                class="bg-red-500 text-white p-2 rounded-lg mt-4">Remove</button>
          </div>
        </a>
      </li>
    </ul>
    <button @click.prevent="clearCart" class="bg-gray-500 text-white p-2 rounded-lg mt-4">Clear Cart</button>
    <div class="mt-4">
      <p class="text-lg font-bold">Total Cost: ${{ totalCost }}</p>
      <p class="text-lg font-bold">Total Items: {{ itemCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useUserCart from './js/UserCart.js';

const { cartItems, isLoading, fetchCartItems, removeFromCart, clearCart } = useUserCart();
const sortPrice = ref('');
const sortType = ref('');
const currentPath = window.location.hash.split('?')[0];

const getBackUrl = () => {
  const prePath = localStorage.getItem('prePath');
  if (!prePath || prePath === 'cart' || prePath === currentPath) {
    return '/#/products';
  }
  return `/#/${prePath}`;
};

const backUrl = getBackUrl();

onMounted(() => {
  const userId = localStorage.getItem("userId");
  fetchCartItems(userId);
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  sortPrice.value = urlParams.get('sortPrice') || '';
  sortType.value = urlParams.get('sortType') || '';
});

const getItemQuantity = (productId) => {
  const item = cartItems.value.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

const totalCost = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
});

const itemCount = computed(() => cartItems.value.length);
</script>
