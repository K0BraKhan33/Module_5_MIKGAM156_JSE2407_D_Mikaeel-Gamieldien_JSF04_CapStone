import { ref, onMounted, computed } from 'vue';

export default function useProductList() {
  const items = ref([]);
  const isLoading = ref(true);
  const sortPrice = ref('');
  const sortType = ref('');
  const categories = ref([]);
  
  async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      items.value = data;
      categories.value = [...new Set(data.map(item => item.category))];
      isLoading.value = false;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  onMounted(() => {
    fetchProducts();
  });

  const filteredItems = computed(() => {
    let sortedItems = [...items.value];

    if (sortPrice.value) {
      if (sortPrice.value === 'priceAsc') {
        sortedItems.sort((a, b) => a.price - b.price);
      } else if (sortPrice.value === 'priceDesc') {
        sortedItems.sort((a, b) => b.price - a.price);
      } else if (sortPrice.value === 'titleAsc') {
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortPrice.value === 'titleDesc') {
        sortedItems.sort((a, b) => b.title.localeCompare(a.title));
      }
    }

    if (sortType.value) {
      sortedItems = sortedItems.filter(item => item.category === sortType.value);
    }

    return sortedItems;
  });

  const isDefaultSort = computed(() => !sortPrice.value && !sortType.value);

  function handleSortChange() {
    filteredItems.value = filteredItems.value;
  }

  function resetFilters() {
    sortPrice.value = '';
    sortType.value = '';
  }

  return {
    items,
    filteredItems,
    isLoading,
    sortPrice,
    sortType,
    categories,
    handleSortChange,
    resetFilters,
    isDefaultSort
  };
}
