<template>
  <div :class="['p-4', themeClass]">
    <div class="flex flex-col md:flex-row md:justify-between">
      <!-- Sorting Controls -->
      <div class="mb-4 md:mb-0">
        <label for="sortPrice" :class="labelClass">Sort by Price:</label>
        <select 
          id="sortPrice" 
          v-model="selectedSortPrice" 
          @change="updateSortPrice" 
          :class="selectClass"
        >
          <option value="">Select</option>
          <option value="lowest">Lowest to Highest</option>
          <option value="highest">Highest to Lowest</option>
        </select>
      </div>

      <div class="mb-4 md:mb-0">
        <label for="sortType" :class="labelClass">Sort by Title:</label>
        <select 
          id="sortType" 
          v-model="selectedSortType" 
          @change="updateSortType" 
          :class="selectClass"
        >
          <option value="">Select</option>
          <option value="AtoZ">A to Z</option>
          <option value="ZtoA">Z to A</option>
        </select>
      </div>

      <!-- Category Filter -->
      <div class="mb-4 md:mb-0">
        <label for="category" :class="labelClass">Filter by Category:</label>
        <select 
          id="category" 
          v-model="selectedCategory" 
          @change="filterCategory" 
          :class="selectClass"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Reset Filters and Sorting -->
      <button 
        @click="resetFilters" 
        :class="['mt-4 md:mt-0 px-4 py-2 rounded', resetButtonClass]"
      >
        Reset Filters & Sorting
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  categories: Array,
  sortPrice: String,
  sortType: String,
  isDefaultSort: Boolean,
});

const emit = defineEmits(['update:sortPrice', 'update:sortType', 'filter-category', 'reset']);

const selectedSortPrice = ref(props.sortPrice);
const selectedSortType = ref(props.sortType);
const selectedCategory = ref('');

const updateSortPrice = () => {
  emit('update:sortPrice', selectedSortPrice.value);
};

const updateSortType = () => {
  emit('update:sortType', selectedSortType.value);
};

const filterCategory = () => {
  emit('filter-category', selectedCategory.value);
};

const resetFilters = () => {
  selectedSortPrice.value = '';
  selectedSortType.value = '';
  selectedCategory.value = '';
  emit('reset');
};

const themeClass = computed(() => localStorage.getItem('theme') === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100');
const labelClass = computed(() => localStorage.getItem('theme') === 'light' ? 'text-gray-900' : 'text-gray-100');
const selectClass = computed(() => localStorage.getItem('theme') === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-800 text-gray-100');
const resetButtonClass = computed(() => localStorage.getItem('theme') === 'light' ? 'bg-red-500 text-white' : 'bg-red-700 text-gray-100');

// Watch for prop changes
watch(() => props.sortPrice, (newVal) => {
  selectedSortPrice.value = newVal;
});

watch(() => props.sortType, (newVal) => {
  selectedSortType.value = newVal;
});

onMounted(() => {
  if (props.isDefaultSort) {
    selectedSortPrice.value = 'lowest'; // or any default value
    selectedSortType.value = 'AtoZ'; // or any default value
  }
});
</script>
