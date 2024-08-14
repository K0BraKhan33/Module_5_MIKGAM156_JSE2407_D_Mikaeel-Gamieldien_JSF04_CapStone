import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export const totalProducts = ref(0); // Initialize totalProducts as a ref

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

  // Function to show user notifications
  function showNotification(message) {
    alert(message); // Simple example
  }

  async function fetchProducts() {
    if (!userId.value) {
      console.error('User ID is not set');
      showNotification('Please log in to fetch products.');
      return;
    }

    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      filteredItems.value = data;
      
      // Update totalProducts based on the number of products fetched
      totalProducts.value = filteredItems.value.length;

      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
      handleSortChange();
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Error fetching products. Please try again later.');
    }
  }

  function addToCart(item) {
    if (!userId.value) {
      showNotification('Please log in to add items to the cart.');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem(`${userId.value}cartItems`)) || [];
    cartItems.push(item);
    localStorage.setItem(`${userId.value}cartItems`, JSON.stringify(cartItems));
    console.log('Adding to cart:', cartItems);
  }

  function handleSortChange() {
    // Your sorting logic here
  }

  function goToComparison() {
    router.push(userId.value ? '/compare' : '/login');
  }

  function handleAuthButtonClick() {
    if (loggedIn.value) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('comparisonList');
      localStorage.removeItem('prePath');
      localStorage.setItem('loggedIn', 'false');
      loggedIn.value = false;
    } else {
      localStorage.setItem('loggedIn', 'true');
      router.push('/login?redirect=wishlist');
    }
  }

  function extractNumericId(id) {
    return id ? id.match(/\d+/)?.[0] || '' : '';
  }

  function redirectToCart() {
    if (loggedIn.value) {
      router.push(`/cart?sortPrice=${sortPrice.value}&sortType=${sortType.value}`);
    } else {
      showNotification('You are not logged in.');
    }
  }

  function redirectToWishlist() {
    router.push(userId.value ? `/wishlist?userId=${userId.value}` : '/login?redirect=wishlist');
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

  onMounted(() => {
    const prePath = localStorage.getItem('prePath');
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromStorage = localStorage.getItem('userId');
    const userIdFromUrl = urlParams.get('userId') || userIdFromStorage;

    userId.value = extractNumericId(userIdFromUrl);
    loggedIn.value = localStorage.getItem('loggedIn') === 'true';
    comparisonList.value = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    localStorage.setItem('prePath', window.location.hash.split('?')[0].split('/')[1]);

    fetchProducts();
  });

  return {
    filteredItems,
    isLoading,
    sortPrice,
    sortType,
    categories,
    addToCart,
    fetchProducts,
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
