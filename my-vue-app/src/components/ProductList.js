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
      handleSortChange(); // Apply sorting after fetching
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function handleSortChange() {
    let items = [...filteredItems.value]; // Create a copy to sort
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
    isDefaultSort.value = !sortPrice.value && !sortType.value; // Check if sorting is default
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
