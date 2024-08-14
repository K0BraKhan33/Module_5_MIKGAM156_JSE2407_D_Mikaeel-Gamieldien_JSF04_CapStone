import { ref } from 'vue';
import { totalProducts } from './ProductList';

export default function useDiscount() {
    async function getProduct() {
        const selectedProductIds = new Set();

        // Generate 5 unique random product IDs
        while (selectedProductIds.size < 5) {
            const randomProductId = Math.floor(Math.random() * totalProducts.value) + 1;
            selectedProductIds.add(randomProductId);
        }

        // Convert the set to an array to access elements by index
        const productIdsArray = Array.from(selectedProductIds);

        // Loop through the product IDs and fetch their details from the API
        for (let i = 0; i < productIdsArray.length; i++) {
            const randomProductId = productIdsArray[i];
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${randomProductId}`);
                const productData = await response.json();
                console.log(`Product ${i + 1}:`, productData);
            } catch (error) {
                console.error(`Failed to fetch data for product ID ${randomProductId}:`, error);
            }
        }

        console.log("________________________________________________________________________________________________________________________________");
    }

    return {
        getProduct
    }
}
