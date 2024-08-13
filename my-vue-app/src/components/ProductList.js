//ProductList.js
import { ref, onMounted } from 'vue';

export default function useProductList() {
  const filteredItems = ref([]);
  const isLoading = ref(true);
  const sortPrice = ref('');
  const sortType = ref('');
  const categories = ref([]);
  const isDefaultSort = ref(true);
  const userId = ref(null); // Add userId ref

  async function fetchProducts() {
    if (!userId.value) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await fetch('https://fakestoreapi.com/products'); // Modify if needed to include userId
      const data = await response.json();
      filteredItems.value = data;
      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function handleSortChange() {
    if (sortPrice.value) {
      filteredItems.value.sort((a, b) => sortPrice.value === 'asc' ? a.price - b.price : b.price - a.price);
    }
    if (sortType.value) {
      filteredItems.value.sort((a, b) => sortType.value === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    }
  }

  onMounted(() => {
    // Assuming you set the userId from somewhere (e.g., after login)
    userId.value = 'someUserId'; // Replace with actual user ID retrieval logic
    fetchProducts();
  });

  return {
    filteredItems,
    isLoading,
    sortPrice,
    sortType,
    categories,
    handleSortChange,
    isDefaultSort
  };
}
