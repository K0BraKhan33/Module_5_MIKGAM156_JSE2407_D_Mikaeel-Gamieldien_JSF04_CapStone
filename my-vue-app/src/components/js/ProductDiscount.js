// Discount.js
import { ref } from 'vue';
import { totalProducts } from './ProductList';

export default function useDiscount() {
    function getProduct() {
        for (let i = 0; i < 6; i++) {
            // Generate a random integer between 0 and totalProducts - 1
            const randomProductId = Math.floor(Math.random() * totalProducts);
            console.log(randomProductId);
        }
    }

    return {
        getProduct
    }
}
