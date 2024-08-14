import { ref, onMounted, watch } from 'vue';
import jwtDecode from 'jwt-decode';

/**
 * Custom hook to manage the user's shopping cart.
 * 
 * @returns {Object} - Returns an object with references to the cart and cart items, and functions to manipulate the cart.
 */
export default function useUserCart() {
  const cart = ref([]);
  const cartItems = ref([]);
  const productIds = ref([]);
  const itemCount = ref(0); // For tracking the number of items
  const totalCost = ref(0); // For tracking the total cost
  const userId = ref(null); // For user ID
  const isLoggedIn = ref(false);

  // Retrieve and parse the user ID from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    userId.value = decoded.userId;
    isLoggedIn.value = true;
  }

  onMounted(() => {
    if (isLoggedIn.value) {
      fetchCartItems();
    }
  });

  watch(cart, (newCart) => {
    itemCount.value = newCart.reduce((total, item) => total + item.quantity, 0);
    totalCost.value = newCart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    // Update localStorage or other persistent storage as needed
    localStorage.setItem(`${userId.value}cartItems`, JSON.stringify(newCart));
  }, { deep: true });

  /**
   * Fetches the user's cart items from the API.
   * 
   * @async
   * @returns {Promise<void>} - A promise that resolves when the cart items are fetched and updated.
   */
  const fetchCartItems = async () => {
    try {
      const cartData = localStorage.getItem(`${userId.value}cartItems`);
      const cartItemsArray = JSON.parse(cartData) || [];
      console.log(cartItemsArray);

      if (Array.isArray(cartItemsArray) && cartItemsArray.length > 0) {
        cartItems.value = cartItemsArray;
        cart.value = cartItemsArray.map(item => ({ ...item, quantity: item.quantity || 1 }));
        console.log(cart.value);

        // Fetch product details for each product in the cart
        for (const item of cart.value) {
          try {
            const response = await fetch(`https://fakestoreapi.com/products/${item.id}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const productData = await response.json();
            productIds.value.push(productData);
          } catch (error) {
            console.error('Error fetching product details:', error);
          }
        }
      } else {
        console.warn('No cart data found.');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  /**
   * Adds an item to the cart.
   * @param {Object} product - The product to add to the cart.
   * @param {number} quantity - The quantity of the product.
   */
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({ ...product, quantity });
    }
  };

  /**
   * Updates the quantity of an item in the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} quantity - The new quantity of the product.
   */
  const updateQuantity = (productId, quantity) => {
    const item = cart.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  };

  /**
   * Removes an item from the cart.
   * @param {number} productId - The ID of the product to remove.
   */
  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId);
    productIds.value = productIds.value.filter(item => item.id !== productId);
  };

  /**
   * Clears the cart.
   */
  const clearCart = () => {
    cart.value = [];
    productIds.value = [];
    localStorage.removeItem(`${userId.value}cartItems`); // Clear from localStorage
  };

  return {
    cart,
    cartItems,
    productIds,
    itemCount,
    totalCost,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
