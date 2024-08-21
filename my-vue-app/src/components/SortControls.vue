<template>
  <div :class="['p-4', themeClass, 'flex space-x-4']">
    <div>
      <!-- Sort by Title or Price Dropdown -->
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
      <!-- Sort by Type Dropdown -->
      <label for="sortType" :class="labelClass">Sort by Type</label>
      <select id="sortType" v-model="localSortType" @change="updateRouteWithFilters" :class="selectClass">
        <option value="">Select</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
    <!-- Reset Filters Button -->
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
    /**
     * Categories to display in the sort type dropdown.
     * @type {Array<string>}
     */
    categories: Array,

    /**
     * Boolean indicating if the default sorting is active.
     * @type {Boolean}
     */
    isDefaultSort: Boolean
  },
  data() {
    return {
      /**
       * Local state for sort price filter.
       * @type {string}
       */
      localSortPrice: this.$route.query.sortPrice || '',

      /**
       * Local state for sort type filter.
       * @type {string}
       */
      localSortType: this.$route.query.sortType || '',

      /**
       * Current theme of the application.
       * @type {string}
       */
      currentTheme: localStorage.getItem('theme') || 'light'
    };
  },
  methods: {
    /**
     * Update the route with current sort filters.
     */
    updateRouteWithFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          sortPrice: this.localSortPrice || undefined,
          sortType: this.localSortType || undefined
        }
      });
    },

    /**
     * Reset sort filters to default values.
     */
    resetFilters() {
      this.localSortPrice = '';
      this.localSortType = '';
      this.updateRouteWithFilters();
    },

    /**
     * Handle theme change event by updating the current theme.
     */
    handleThemeChange() {
      this.currentTheme = localStorage.getItem('theme') || 'light';
    }
  },
  watch: {
    /**
     * Watch for changes in the route query parameter for sort price.
     * @param {string} newSortPrice - New value of the sort price filter.
     */
    '$route.query.sortPrice'(newSortPrice) {
      this.localSortPrice = newSortPrice || '';
    },

    /**
     * Watch for changes in the route query parameter for sort type.
     * @param {string} newSortType - New value of the sort type filter.
     */
    '$route.query.sortType'(newSortType) {
      this.localSortType = newSortType || '';
    },

    /**
     * Watch for changes in the current theme.
     * @param {string} newTheme - New value of the theme.
     */
    currentTheme(newTheme) {
      this.currentTheme = newTheme;
    }
  },
  mounted() {
    /**
     * Add event listener for theme change on component mount.
     */
    window.addEventListener('theme-changed', this.handleThemeChange);
  },
  beforeUnmount() {
    /**
     * Remove event listener for theme change before component unmount.
     */
    window.removeEventListener('theme-changed', this.handleThemeChange);
  },
  computed: {
    /**
     * Compute the class for the main container based on the current theme.
     * @returns {string} - The class for the container.
     */
    themeClass() {
      return this.currentTheme === 'light' ? 'bg-grey-900 text-gray-900' : 'bg-grey-900 text-gray-900';
    },

    /**
     * Compute the class for labels based on the current theme.
     * @returns {string} - The class for labels.
     */
    labelClass() {
      return this.currentTheme === 'light' ? 'text-pink-600' : 'text-amber-300';
    },

    /**
     * Compute the class for select dropdowns based on the current theme.
     * @returns {string} - The class for select dropdowns.
     */
    selectClass() {
      return this.currentTheme === 'light'
        ? 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
        : 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
    },

    /**
     * Compute the class for the reset filters button based on the current theme.
     * @returns {string} - The class for the reset button.
     */
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
