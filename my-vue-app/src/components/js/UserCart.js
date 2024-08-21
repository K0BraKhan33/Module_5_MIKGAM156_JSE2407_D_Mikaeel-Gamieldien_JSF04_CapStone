// UserCart.js
import { ref, computed, onMounted } from 'vue';

export default function useUserCart() {
    const cartItems = ref([]);
    const userId = localStorage.getItem("userId");
    const sortPrice=ref([]);
    const sortType=ref([]);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
            if (!response.ok) throw new Error("Failed to fetch product details");
            return await response.json();
        } catch (error) {
            console.error("Error fetching product details:", error);
            return null;
        }
    };

    const fetchCartItems = async () => {
        if (!userId) return;

        const cartKey = `${userId}cartItems`;
        const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const productQuantities = {};

        // Count the quantities of each product
        storedCart.forEach(productId => {
            productQuantities[productId] = (productQuantities[productId] || 0) + 1;
        });

        const productDetailsPromises = Object.keys(productQuantities).map(id => fetchProductDetails(id));
        const productDetailsArray = await Promise.all(productDetailsPromises);

        cartItems.value = productDetailsArray.map((details, index) => ({
            ...details,
            quantity: productQuantities[details.id]
        })).filter(item => item !== null);
    };

    const updateCartItem = (productId, quantity) => {
        const cartKey = `${userId}cartItems`;
        let storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Remove all instances of productId
        storedCart = storedCart.filter(id => id !== productId);

        // Add the productId `quantity` number of times
        for (let i = 0; i < quantity; i++) {
            storedCart.push(productId);
        }

        localStorage.setItem(cartKey, JSON.stringify(storedCart));
        fetchCartItems();
    };

    const removeCartItem = (productId) => {
        const cartKey = `${userId}cartItems`;
        let storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Remove all instances of productId
        storedCart = storedCart.filter(id => id !== productId);

        localStorage.setItem(cartKey, JSON.stringify(storedCart));
        fetchCartItems();
    };

    const updateBackLink = () => {
        const backLink = document.getElementById('backLink');
        if (backLink) {
          // Update the back link with sorting and filtering parameters
          const url = new URL(window.location.href);
          url.hash = `#/products/?sortPrice=${sortPrice.value}&sortType=${sortType.value}`;
          backLink.href = url.toString();
        }
      };

    const clearCart = () => {
        const cartKey = `${userId}cartItems`;
        localStorage.removeItem(cartKey);
        fetchCartItems();
    };

    const totalCost = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2);
    });

    const itemCount = computed(() => cartItems.value.reduce((count, item) => count + item.quantity, 0));

    onMounted(fetchCartItems);

    return {
        cartItems,
        totalCost,
        itemCount,
        fetchCartItems,
        updateCartItem,
        removeCartItem,
        clearCart,
        updateBackLink
    };
}
