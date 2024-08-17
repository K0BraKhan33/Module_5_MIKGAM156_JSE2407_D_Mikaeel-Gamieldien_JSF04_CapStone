//UserCart.js
import { ref } from 'vue';

export default function useUserCart() {
  const cartItems = ref([]);
  const isLoading = ref(true);

  async function fetchCartItems(userId) {
    if (!userId) {
      console.error('User ID is not provided');
      return;
    }

    const cartItemsKey = `${userId}cartItems`;
    const storedCartItems = localStorage.getItem(cartItemsKey);

    if (storedCartItems) {
      try {
        const cartItemsArray = JSON.parse(storedCartItems);
        if (Array.isArray(cartItemsArray)) {
          cartItems.value = cartItemsArray;
        } else {
          console.warn('Cart items data is not an array');
          cartItems.value = [];
        }
      } catch (error) {
        console.error('Error parsing cart items:', error);
        cartItems.value = [];
      }
    } else {
      cartItems.value = [];
    }

    isLoading.value = false;
  }

  function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const cartItemsKey = `${userId}cartItems`;
    const cartItemsArray = cartItems.value;
    const productIndex = cartItemsArray.findIndex(item => item.id === productId);

    if (productIndex >= 0) {
      cartItemsArray[productIndex].quantity += 1;
    } else {
      cartItemsArray.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem(cartItemsKey, JSON.stringify(cartItemsArray));
    cartItems.value = cartItemsArray;
  }

  function removeFromCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const cartItemsKey = `${userId}cartItems`;
    const cartItemsArray = cartItems.value;

    const updatedCartItems = cartItemsArray.filter(item => item.id !== productId);

    localStorage.setItem(cartItemsKey, JSON.stringify(updatedCartItems));
    cartItems.value = updatedCartItems;
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
    clearCart
  };
}
