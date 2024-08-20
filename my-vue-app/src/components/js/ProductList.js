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
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      filteredItems.value = data;
      
      // Update totalProducts based on the number of products fetched
      totalProducts.value = filteredItems.value.length;

      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
      handleSortChange(); // Call handleSortChange after fetching products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function addToCart(productId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to add items to the cart.");
      return;
    }
    const cartKey = `${userId}cartItems`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // Add product to cart
    cart.push(productId);

    localStorage.setItem(cartKey, JSON.stringify(cart));

    // Notify the cart update
    const event = new CustomEvent("cart-updated");
    window.dispatchEvent(event);
  }

  function goToComparison() {
    const userId = localStorage.getItem("userId");
    if(!userId){
      alert("You must be logged in to access Comparason Table.");
      return;
    
  }
  else{
   
    router.push('/compare');
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

  function extractNumericId(id) {
    return id ? id.match(/\d+/)?.[0] || '' : '';
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

  function handleSortChange() {
    let sortedItems = [...filteredItems.value];

    if (sortPrice.value) {
      sortedItems.sort((a, b) => {
        const priceComparison = sortPrice.value === 'low-to-high'
          ? a.price - b.price
          : b.price - a.price;
        
        return priceComparison;
      });
    }

    if (sortType.value) {
      sortedItems.sort((a, b) => {
        const titleComparison = a.title.localeCompare(b.title);
        return sortType.value === 'A-Z' ? titleComparison : -titleComparison;
      });
    }

    filteredItems.value = sortedItems;
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
