<template>
  <div class="bg-purple-300 flex p-max space-x-4">
    <div>
      <label for="sortCriteria" class="block text-sm font-medium text-gray-700">Sort by</label>
      <select id="sortCriteria" v-model="localSortCriteria" @change="emitSortChange"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option value="">Select</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="titleAsc">Title: A to Z</option>
        <option value="titleDesc">Title: Z to A</option>
      </select>
    </div>
    <div>
      <label for="categoryFilter" class="block text-sm font-medium text-gray-700">Filter by Category</label>
      <select id="categoryFilter" v-model="localCategory" @change="emitSortChange"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
    <button v-if="!isDefaultSort" @click="resetFilters" class="mt-6 py-2 px-4 bg-red-500 text-white rounded-md">Reset Filters</button>
  </div>
</template>

<script>
export default {
  name: 'SortControls',
  props: {
    sortCriteria: String,
    categories: Array,
    selectedCategory: String,
    isDefaultSort: Boolean
  },
  data() {
    return {
      localSortCriteria: this.sortCriteria,
      localCategory: this.selectedCategory
    };
  },
  methods: {
    emitSortChange() {
      this.$emit('update:sortCriteria', this.localSortCriteria);
      this.$emit('update:selectedCategory', this.localCategory);
      this.$emit('sort-change');
    },
    resetFilters() {
      this.localSortCriteria = '';
      this.localCategory = '';
      this.emitSortChange();
    }
  },
  watch: {
    sortCriteria(newVal) {
      this.localSortCriteria = newVal;
    },
    selectedCategory(newVal) {
      this.localCategory = newVal;
    }
  },
  async created() {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const categories = await response.json();
      this.$emit('update:categories', categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
