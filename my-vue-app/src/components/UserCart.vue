<template>
    <div>
        <h2>Your Cart</h2>
        <ul class="flex flex-wrap">
            <li v-for="item in productIds" :key="item.id"
                class="flex flex-col w-full md:w-1/2 lg:w-1/4 p-4 min-h-[60vw] sm:min-h-[25vw] md:min-h-[20vw] lg:min-h-[15vw] cursor-pointer">
                <a :href="`/#/about?id=${item.id}&sortPrice=${sortPrice}&sortType=${sortType}`"
                    class="block h-full">
                    <div class="border-2 border-purple-800 bg-purple-300 p-4 rounded-lg h-full flex flex-col">
                        <img :src="item.image" :alt="item.title"
                            class="w-full max-h-[35vw] sm:max-h-[20vw] md:max-h-[30vw] lg:max-h-[25vw] object-contain mb-4">
                        <div class="flex flex-col flex-grow">
                            <div class="mb-4">
                                <h2 class="font-bold text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]">{{
                                    item.title }}</h2>
                            </div>
                            <div class="flex flex-col mb-4">
                                <p class="text-gray-700 text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw]">{{ '$' +
                                    item.price }}</p>
                                <p class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mb-0">
                                    Quantity: {{ getItemQuantity(item.id) }}</p>
                                <div class="flex items-center">
                                    <span
                                        class="text-[4vw] lg:text-[1.5vw] md:text-[2vw] sm:text-[3vw] text-gray-800 mr-2">Rating:</span>
                                    <div class="flex items-center">
                                        <svg v-for="n in Math.floor(item.rating.rate)" :key="`filled-${n}`"
                                            xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                                        </svg>
                                        <svg v-for="n in Math.ceil(item.rating.rate - Math.floor(item.rating.rate))"
                                            :key="`half-${n}`" xmlns="http://www.w3.org/2000/svg"
                                            class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                                        </svg>
                                        <svg v-for="n in 5 - Math.ceil(item.rating.rate)" :key="`empty-${n}`"
                                            xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 17.27l6.18 3.85-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.35-1.64 7.03L12 17.27z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button @click.prevent="removeFromCart(item.id)"
                            class="bg-red-500 text-white p-2 rounded-lg mt-4">Remove</button>
                    </div>
                </a>
            </li>
        </ul>
        <button @click.prevent="clearCart" class="bg-gray-500 text-white p-2 rounded-lg mt-4">Clear Cart</button>
        <button @click.prevent="goToLogin" class="bg-blue-500 text-white p-2 rounded-lg mt-4">Login</button>
    </div>
</template>

<script>
import useUserCart from './UserCart.js';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const { cart, productIds, removeFromCart, clearCart, loadCart } = useUserCart();

        // Define missing properties with default values
        const sortPrice = ref(''); // Initialize with default or fetch value as needed
        const sortType = ref('');  // Initialize with default or fetch value as needed

        // Create a URLSearchParams instance to handle URL parameters
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);

        // Load cart data when the component is created
        onMounted(() => {
            loadCart();
            sortPrice.value = urlParams.get('sortPrice') || ''; // Get sorting criteria for price
            sortType.value = urlParams.get('sortType') || ''; // Get sorting criteria for type

            console.log('URL parameters:', { sortPrice: sortPrice.value, sortType: sortType.value });
        });

        const goToLogin = () => {
            window.location.href = `/#/login?sortPrice=${sortPrice.value}&sortType=${sortType.value}`; // Use window.location.href to redirect
        };

        const getItemQuantity = (productId) => {
            const item = cart.value.find(item => item.productId === productId);
            return item ? item.quantity : 0;
        };

        return {
            cart,
            productIds,
            removeFromCart,
            clearCart,
            goToLogin,
            getItemQuantity,
            sortPrice,
            sortType
        };
    },
};
</script>
