import { ref } from 'vue';

/**
 * Custom hook to manage the user's shopping cart.
 * 
 * @returns {Object} - Returns an object with references to the cart and cart items, and functions to manipulate the cart.
 */
export default function useUserCart() {
  const cart = ref([]);
  const cartItems = ref([]);
  const productIds = ref([]);
  const currentId = ref('');

  // Retrieve and parse the user ID from localStorage
  const localIdString = localStorage.getItem('userId');

  /**
   * Fetches the user's cart items from the API.
   * 
   * @async
   * @returns {Promise<void>} - A promise that resolves when the cart items are fetched and updated.
   */
  const fetchCartItems = async () => {
    try {
      if (!localIdString) {
        console.error('User ID is not available in localStorage.');
        return;
      }

      const response = await fetch(`https://fakestoreapi.com/carts/user/${localIdString}`); // Fetch cart for the current user ID
      const data = await response.json();

      // Ensure cartItems is an array before accessing it
      if (Array.isArray(data) && data.length > 0) {
        cartItems.value = data;
        cart.value = data[0].products || []; // Ensure products property is defined

        // Fetch product details for each product in the cart
        for (const item of cart.value) {
          try {
            const responseId = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
            const dataId = await responseId.json();
            productIds.value.push(dataId); // Push the product details into the productIds array
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
   */
  const addToCart = (product) => {
    cart.value.push(product);
  };

  /**
   * Removes an item from the cart.
   * @param {number} productId - The ID of the product to remove.
   */
  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.productId !== productId);
    productIds.value = productIds.value.filter(item => item.id !== productId);
  };

  /**
   * Clears the cart.
   */
  const clearCart = () => {
    cart.value = [];
    productIds.value = [];
  };

  /**
   * Loads the cart data (calls the API).
   */
  const loadCart = () => {
    fetchCartItems();
  };

  return {
    cart,
    cartItems,
    productIds,
    addToCart,
    removeFromCart,
    clearCart,
    loadCart,
  };
}
