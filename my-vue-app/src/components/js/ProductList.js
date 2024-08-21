import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Total number of products
export const totalProducts = ref(0);

export default function useProductList() {
  // Reactive references
  const filteredItems = ref([]); // List of filtered products
  const isLoading = ref(true); // Loading state
  const sortPrice = ref(''); // Sorting criteria for price
  const sortType = ref(''); // Sorting criteria for type/category
  const categories = ref([]); // List of product categories
  const isDefaultSort = ref(true); // Flag for default sorting
  const userId = ref(null); // User ID
  const loggedIn = ref(false); // Login state
  const comparisonList = ref([]); // List of products to compare
  const router = useRouter(); // Router instance for navigation
  const originalList = ref([]); // Original list of products (before sorting/filtering)
  const route = useRoute(); // Route instance to access URL parameters

  // Show a notification message
  function showNotification(message) {
    alert(message); // Simple notification example
  }

  // Fetch products from the API and initialize data
  async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      filteredItems.value = data;
      originalList.value = [...data]; // Initialize originalList here
      totalProducts.value = filteredItems.value.length;
      categories.value = [...new Set(data.map(item => item.category))]; // Extract unique categories
      isLoading.value = false;
      handleSortChange(); // Apply initial sorting and filtering
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Handle sorting and filtering based on current criteria
  function handleSortChange() {
    let sortedItems = [...originalList.value]; // Copy original list for sorting/filtering

    // Filter by category if a category is selected
    if (sortType.value && sortType.value !== '') {
      sortedItems = sortedItems.filter(item => item.category === sortType.value);
    }

    // Sort items based on the selected sorting criteria
    if (sortPrice.value) {
      sortedItems.sort((a, b) => {
        switch (sortPrice.value) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'titleAsc':
            return a.title.localeCompare(b.title);
          case 'titleDesc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    filteredItems.value = sortedItems;
    updateUrlParams(); // Update URL parameters with current sorting/filtering criteria
  }

  // Update URL parameters for sorting and filtering
  function updateUrlParams() {
    router.push({
      query: {
        sortPrice: sortPrice.value || undefined,
        sortType: sortType.value || undefined
      }
    });
  }

  // Reset sorting and filtering to default values
  function resetFilters() {
    sortPrice.value = '';
    sortType.value = '';
    handleSortChange();
  }

  // Add product to cart if the user is logged in
  function addToCart(productId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to add items to the cart.");
      return;
    }
    const cartKey = `${userId}cartItems`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.push(productId);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated")); // Notify about cart update
  }

  // Navigate to comparison page if the user is logged in
  function goToComparison() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to access the Comparison Table.");
      return;
    } else {
      router.push(`/compare?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    }
  }

  // Handle authentication button click for login/logout
  function handleAuthButtonClick() {
    if (loggedIn.value) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('comparisonList');
      localStorage.setItem('loggedIn', 'false');
      loggedIn.value = false;
    } else {
      localStorage.setItem('loggedIn', 'true');
      router.push('/login?redirect=wishlist');
    }
  }

  // Redirect to cart page if the user is logged in
  function redirectToCart() {
    if (loggedIn.value) {
      localStorage.setItem('prePath', 'products');
      router.push(`/cart?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    } else {
      showNotification('You are not logged in. Please log in to access the cart.');
    }
  }

  // Redirect to wishlist page if the user is logged in
  function redirectToWishlist() {
    if (userId.value) {
      router.push(`/wishlist?userId=${userId.value}`);
    } else {
      showNotification('You are not logged in. Please log in to access the wishlist.');
    }
  }

  // Toggle product in comparison list
  function toggleComparison(item) {
    let comparisonListArray = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    const itemIndex = comparisonListArray.findIndex(i => i.id === item.id);
    if (itemIndex >= 0) {
      comparisonListArray.splice(itemIndex, 1);
    } else {
      if (comparisonListArray.length < 5) {
        comparisonListArray.push(item);
      } else {
        showNotification('You can compare up to 5 products only.');
        return;
      }
    }
    localStorage.setItem('comparisonList', JSON.stringify(comparisonListArray));
    comparisonList.value = comparisonListArray;
  }

  // Check if a product is in the comparison list
  function isInComparison(itemId) {
    return comparisonList.value.some(item => item.id === itemId);
  }

  // Update sorting criteria for price
  function updateSortPrice(newSortPrice) {
    sortPrice.value = newSortPrice;
    handleSortChange();
  }

  // Update sorting criteria for type/category
  function updateSortType(newSortType) {
    sortType.value = newSortType;
    handleSortChange();
  }

  // Extract numeric ID from a string
  function extractNumericId(id) {
    return parseInt(id, 10);
  }

  // On component mount
  onMounted(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    const userIdFromUrl = route.query.userId || userIdFromStorage;

    userId.value = extractNumericId(userIdFromUrl);
    loggedIn.value = localStorage.getItem('loggedIn') === 'true';
    comparisonList.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    sortPrice.value = route.query.sortPrice || '';
    sortType.value = route.query.sortType || '';

    fetchProducts();
  });

  // Watch for route query changes and update sorting/filtering
  watch(() => route.query, () => {
    sortPrice.value = route.query.sortPrice || '';
    sortType.value = route.query.sortType || '';
    handleSortChange();
  }, { immediate: true });

  return {
    filteredItems,
    isLoading,
    sortPrice,
    sortType,
    categories,
    addToCart,
    fetchProducts,
    extractNumericId,
    userId,
    handleSortChange,
    isDefaultSort,
    goToComparison,
    handleAuthButtonClick,
    redirectToCart,
    redirectToWishlist,
    toggleComparison,
    isInComparison,
    updateSortPrice,
    updateSortType,
    loggedIn,
    comparisonList,
    totalProducts
  };
}
