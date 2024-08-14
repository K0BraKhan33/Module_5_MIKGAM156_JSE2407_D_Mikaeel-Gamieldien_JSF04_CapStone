import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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

  async function fetchProducts() {
    if (!userId.value) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      filteredItems.value = data;
      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
      handleSortChange();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error state here
    }
  }

  function addToCart(item) {
    if (!userId.value) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem(`${userId.value}cartItems`)) || [];
    cartItems.push(item);
    localStorage.setItem(`${userId.value}cartItems`, JSON.stringify(cartItems));
    console.log('Adding to cart:', cartItems);
  }

  function handleSortChange() {
    let items = [...filteredItems.value];
    if (sortPrice.value === 'priceAsc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortPrice.value === 'priceDesc') {
      items.sort((a, b) => b.price - a.price);
    }

    if (sortType.value === 'titleAsc') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType.value === 'titleDesc') {
      items.sort((a, b) => b.title.localeCompare(a.title));
    }

    filteredItems.value = items;
    isDefaultSort.value = !sortPrice.value && !sortType.value;
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
      alert('You are not logged in');
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
        alert('You can compare up to 5 products only.');
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
    comparisonList
  };
}
