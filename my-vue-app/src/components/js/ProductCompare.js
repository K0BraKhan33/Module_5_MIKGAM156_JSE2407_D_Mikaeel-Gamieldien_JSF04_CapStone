// ProductCompare.js
//set max amount of targets
const MAX_COMPARISON_ITEMS = 10;

export function addToComparison(item) {
  const comparisonItems = JSON.parse(localStorage.getItem('comparisonItems')) || [];
  //gets the list
  if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
    alert('You can only compare up to 5 items.');
    return;
  }
  //stores the list
  if (!comparisonItems.find(existingItem => existingItem.id === item.id)) {
    comparisonItems.push(item);
    localStorage.setItem('comparisonItems', JSON.stringify(comparisonItems));
  } else {
    alert('Item already in comparison list.');
  }
}

//init
export function getComparisonItems() {
  return JSON.parse(localStorage.getItem('comparisonItems')) || [];
}
//table update
export function removeFromComparison(itemId) {
  const comparisonItems = JSON.parse(localStorage.getItem('comparisonItems')) || [];
  const updatedItems = comparisonItems.filter(item => item.id !== itemId);
  localStorage.setItem('comparisonItems', JSON.stringify(updatedItems));
}

export function clearComparisonList() {
  localStorage.removeItem('comparisonItems');
}
