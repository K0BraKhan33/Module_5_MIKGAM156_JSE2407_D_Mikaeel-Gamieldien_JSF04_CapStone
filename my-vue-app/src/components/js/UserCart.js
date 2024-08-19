// UserCart.js
import { ref } from 'vue';
import filteredItems from './ProductList.js';

export default function useUserCart() {
  const cartItems = ref([]);
  const isLoading = ref(true);
  const pItems = ref(filteredItems);

  async function fetchCartItems(userId) {
    // Implementation
  }

  function addToCart(productId, quantity = 1) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const cartItemsKey = `${userId}cartItems`;
    let cartItemsArray = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

    // Update item quantity or add new item
    const existingItemIndex = cartItemsArray.findIndex(item => item[0] === productId);
    if (existingItemIndex >= 0) {
      cartItemsArray[existingItemIndex][1] += quantity;
    } else {
      cartItemsArray.push([productId, quantity]);
    }

    localStorage.setItem(cartItemsKey, JSON.stringify(cartItemsArray));
    fetchCartItems(userId);
  }

  function removeFromCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const cartItemsKey = `${userId}cartItems`;
    let cartItemsArray = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

    // Remove productId from cart items array
    cartItemsArray = cartItemsArray.filter(item => item[0] !== productId);
    localStorage.setItem(cartItemsKey, JSON.stringify(cartItemsArray));

    fetchCartItems(userId);
  }

  function clearCart() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const cartItemsKey = `${userId}cartItems`;
      localStorage.removeItem(cartItemsKey);
      cartItems.value = [];
    }
  }

  return {
    cartItems,
    isLoading,
    fetchCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    pItems
  };
}
