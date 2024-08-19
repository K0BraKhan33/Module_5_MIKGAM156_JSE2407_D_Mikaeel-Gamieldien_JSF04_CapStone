//ProjectDiscount.js
// Function to generate a random discount percentage between 5% and 20%
function getRandomDiscount() {
  return Math.floor(Math.random() * 16) + 5;
}

// Function to generate a random future date within 30 days
function getRandomSaleEndDate() {
  const currentDate = new Date();
  const randomDays = Math.floor(Math.random() * 30) + 1;
  currentDate.setDate(currentDate.getDate() + randomDays);
  return currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}


// Function to save discounted products to localStorage
function saveDiscountedProductsToLocalStorage(discountedProducts) {
  localStorage.setItem('discountedProducts', JSON.stringify(discountedProducts));
}

// Function to get discounted products from localStorage
function getDiscountedProductsFromLocalStorage() {
  const storedDiscounts = localStorage.getItem('discountedProducts');
  return storedDiscounts ? JSON.parse(storedDiscounts) : [];
}

// Fetch discounted products
async function fetchDiscountedProducts() {
  const existingDiscounts = getDiscountedProductsFromLocalStorage();

  // If discounts exist in localStorage, reuse them
  if (existingDiscounts.length > 0) {
    return existingDiscounts;
  }

  // Otherwise, generate new discounts
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    const discountedProducts = [];
    const selectedIds = new Set();

    while (discountedProducts.length < 5) {
      const randomIndex = Math.floor(Math.random() * products.length);
      const product = products[randomIndex];

      if (!selectedIds.has(product.id)) {
        const discountPercentage = getRandomDiscount();
        const discountedPrice = (product.price * (1 - discountPercentage / 100)).toFixed(2);

        discountedProducts.push({
          id: product.id,
          title: product.title,
          originalPrice: product.price.toFixed(2),
          discountedPrice,
          discountPercentage,
          image: product.image,
          saleEndDate: getRandomSaleEndDate(),
        });

        selectedIds.add(product.id);
      }
    }

    // Save the generated discounts to localStorage
    saveDiscountedProductsToLocalStorage(discountedProducts);
    return discountedProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

// Export the fetch function
export { fetchDiscountedProducts };

// Assuming you have this function to fetch and handle local storage
export function getDiscountedPriceFromLocalStorage(productId) {
  const discountedProducts = JSON.parse(localStorage.getItem('discountedProducts')) || [];
  const product = discountedProducts.find(p => p.id === productId);
  return product ? product.discountedPrice : null;
}

export function getDiscountPercentageFromLocalStorage(productId) {
  const discountedProducts = JSON.parse(localStorage.getItem('discountedProducts')) || [];
  const product = discountedProducts.find(p => p.id === productId);
  return product ? product.discountPercentage : null;
}
