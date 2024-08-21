import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export const totalProducts = ref(0);

export default function useProductList() {
  const filteredItems = ref([]);
  const isLoading = ref(true);
  const sortPrice = ref('');
  const sortType = ref('');
  const categories = ref([]);
  const isDefaultSort = ref(true);
  const userId = ref(null);
  const loggedIn = ref(false);
  const comparisonList = ref([]);
  const router = useRouter();
  const originalList = ref([]);
  const route = useRoute();

  function showNotification(message) {
    alert(message); // Simple example
  }

  async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      filteredItems.value = data;
      originalList.value = [...data]; // Initialize originalList here
      totalProducts.value = filteredItems.value.length;
      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
      handleSortChange(); // Apply sorting and filtering based on initial URL
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function handleSortChange() {
    let sortedItems = [...originalList.value]; // Use the stored list for filtering and sorting

    if (sortType.value && sortType.value !== '') {
      sortedItems = sortedItems.filter(item => item.category === sortType.value);
    }

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
    updateUrlParams(); // Update URL with current sorting and filtering parameters
  }

  function updateUrlParams() {
    router.push({
      query: {
        sortPrice: sortPrice.value || undefined,
        sortType: sortType.value || undefined
      }
    });
  }

  function resetFilters() {
    sortPrice.value = '';
    sortType.value = '';
    handleSortChange();
  }

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
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function goToComparison() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to access the Comparison Table.");
      return;
    } else {
      router.push(`/compare?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    }
  }

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

  function redirectToCart() {
    if (loggedIn.value) {
      router.push(`/cart?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    } else {
      showNotification('You are not logged in. Please log in to access the cart.');
    }
  }

  function redirectToWishlist() {
    if (userId.value) {
      router.push(`/wishlist?userId=${userId.value}`);
    } else {
      showNotification('You are not logged in. Please log in to access the wishlist.');
    }
  }

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

  function isInComparison(itemId) {
    return comparisonList.value.some(item => item.id === itemId);
  }

  function updateSortPrice(newSortPrice) {
    sortPrice.value = newSortPrice;
    handleSortChange();
  }

  function updateSortType(newSortType) {
    sortType.value = newSortType;
    handleSortChange();
  }

  function extractNumericId(id) {
    return parseInt(id, 10);
  }

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
