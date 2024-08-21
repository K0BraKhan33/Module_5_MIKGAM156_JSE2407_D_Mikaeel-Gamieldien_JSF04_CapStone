<template>
  <div :class="['p-4', themeClass, 'flex space-x-4']">
    <div>
      <label for="sortPrice" :class="labelClass">Sort by Title or Price</label>
      <select id="sortPrice" v-model="localSortPrice" @change="updateRouteWithFilters" :class="selectClass">
        <option value="">Select</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="titleAsc">Title: A to Z</option>
        <option value="titleDesc">Title: Z to A</option>
      </select>
    </div>
    <div>
      <label for="sortType" :class="labelClass">Sort by Type</label>
      <select id="sortType" v-model="localSortType" @change="updateRouteWithFilters" :class="selectClass">
        <option value="">Select</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
    <button v-if="isDefaultSort" @click="resetFilters" :class="resetButtonClass">
      Reset Filters
    </button>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';

export default {
  name: 'SortControls',
  props: {
    categories: Array,
    isDefaultSort: Boolean
  },
  data() {
    return {
      localSortPrice: this.$route.query.sortPrice || '',
      localSortType: this.$route.query.sortType || '',
      currentTheme: localStorage.getItem('theme') || 'light'
    };
  },
  methods: {
    updateRouteWithFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          sortPrice: this.localSortPrice || undefined,
          sortType: this.localSortType || undefined
        }
      });
    },
    resetFilters() {
      this.localSortPrice = '';
      this.localSortType = '';
      this.updateRouteWithFilters();
    },
    handleThemeChange() {
      this.currentTheme = localStorage.getItem('theme') || 'light';
    }
  },
  watch: {
    '$route.query.sortPrice'(newSortPrice) {
      this.localSortPrice = newSortPrice || '';
    },
    '$route.query.sortType'(newSortType) {
      this.localSortType = newSortType || '';
    },
    currentTheme(newTheme) {
      this.currentTheme = newTheme;
    }
  },
  mounted() {
    window.addEventListener('theme-changed', this.handleThemeChange);
  },
  beforeUnmount() {
    window.removeEventListener('theme-changed', this.handleThemeChange);
  },
  computed: {
    themeClass() {
      return this.currentTheme === 'light' ? 'bg-grey-900 text-gray-900' : 'bg-grey-900 text-gray-900';
    },
    labelClass() {
      return this.currentTheme === 'light' ? 'text-pink-600' : 'text-amber-300';
    },
    selectClass() {
      return this.currentTheme === 'light'
        ? 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
        : 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
    },
    resetButtonClass() {
      return this.currentTheme === 'light'
        ? 'mt-6 py-2 px-4 bg-red-500 text-white rounded-md'
        : 'mt-6 py-2 px-4 bg-red-700 text-white rounded-md';
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
