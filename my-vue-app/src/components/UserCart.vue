<template>
  <div>
    <header class="bg-purple-800 p-4 flex items-center">
      <a
        id="backLinkCart"
        :href="backUrl"
        class="text-white text-[4vw] font-bold flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>GoodMarting</span>
      </a>
    </header>

    <h2 class="text-2xl font-bold my-4">Your Cart</h2>

    <ul class="flex flex-wrap">
      <li v-for="item in cartItems" :key="item.id"
          class="flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 min-h-[60vw] sm:min-h-[25vw] md:min-h-[20vw] lg:min-h-[15vw] cursor-pointer">
        <div class="border-2 border-purple-800 bg-purple-300 p-4 rounded-lg h-full flex flex-col">
          <img :src="item.image" :alt="item.title"
              class="w-full max-h-[35vw] sm:max-h-[20vw] md:max-h-[30vw] lg:max-h-[25vw] object-contain mb-4">
          <h2 class="font-bold text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]">{{ item.title }}</h2>
          <p class="text-gray-700 text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw]">{{ '$' + (item.price ? item.price.toFixed(2) : 'N/A') }}</p>
          <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mb-0">Quantity: {{ item.quantity }}</p>

          <input type="number" min="1" :value="item.quantity" @input="updateQuantity(item.id, $event.target.value)"
              class="border p-2 rounded mb-2" />

          <button @click.prevent="removeFromCart(item.id)"
              class="bg-red-500 text-white p-2 rounded-lg">Remove</button>
        </div>
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
import useUserCart from './js/UserCart.js';

const { cartItems, totalCost, itemCount, updateCartItem, removeCartItem, clearCart } = useUserCart();

const getBackUrl = () => {
  const prePath = localStorage.getItem('prePath');
  return !prePath || prePath === 'cart' ? '/#/products' : `/#/${prePath}`;
};

const backUrl = getBackUrl();

const updateQuantity = (productId, quantity) => {
  updateCartItem(productId, parseInt(quantity, 10));
};

const removeFromCart = (productId) => {
  removeCartItem(productId);
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
