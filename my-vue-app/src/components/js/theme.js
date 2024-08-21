import { computed } from 'vue';

export function useTheme(currentTheme) {
  const themeClass = computed(() => {
    return currentTheme.value === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100';
  });
  
  const headerClass = computed(() => {
    return currentTheme.value === 'light' ? 'bg-gray-200 text-pink-300' : 'bg-gray-700 text-amber-600';
  });
  
  const headerLinkClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-white' : 'text-amber-400';
  });
  
  
  const emptyMessageClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-gray-800' : 'text-gray-200';
  });
  
  const tableClass = computed(() => {
    return currentTheme.value === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-200';
  });
  
  const headerCellClass = computed(() => {
    return currentTheme.value === 'light' ? 'border border-gray-300 bg-amber-400 text-gray-900' : 'border border-gray-600 bg-amber-500 text-gray-200';
  });
  
  const rowClass = computed(() => {
    return currentTheme.value === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-800';
  });
  
  const cellClass = computed(() => {
    return currentTheme.value === 'light' ? 'border border-gray-300' : 'border border-gray-600';
  });
  
  const emptyStarClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-gray-300' : 'text-gray-500';
  });
  const headerTextClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-pink-600 text-[3vw]' : 'text-amber-400 text-[3vw] ';
  });
  
  const buttonTextClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
  });
  
  const iconClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
  });
  
  const authButtonClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-pink-600 bg-amber-400' : 'text-amber-400 bg-pink-600';
  });
  
  const hoverButtonClass = computed(() => {
    return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
  });
  
  const hoverIconClass = computed(() => {
    return currentTheme.value === 'light' ? 'hover:text-amber-300 transition' : 'hover:text-pink-600 transition';
  });
  
  const hoverItemClass = computed(() => {
    return currentTheme.value === 'light' ? 'hover:bg-amber-300 transition' : 'hover:bg-pink-600 transition';
  });
  
  const themeListBorderClass = computed(() => {
    return currentTheme.value === 'light' ? 'border-pink-500' : 'border-amber-500';
  });
  
  const itemTitleClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-pink-600' : 'text-amber-400';
  });
  
  const itemPriceClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-gray-900' : 'text-gray-100';
  });
  
  const itemCategoryClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-gray-600' : 'text-gray-300';
  });
  
  const itemRatingClass = computed(() => {
    return currentTheme.value === 'light' ? 'text-gray-600' : 'text-gray-300';
  });

  return {
    themeClass,
    headerClass,
    headerLinkClass,
    headerTextClass,
    emptyMessageClass,
    tableClass,
    headerCellClass,
    rowClass,
    cellClass,
    emptyStarClass,
    headerTextClass,
    buttonTextClass,
    iconClass,
    authButtonClass,
    hoverButtonClass,
  };
}
