//ProjectDetail.js
import { ref, onMounted } from 'vue';

export function useProductDetail() {
  const product = ref({});
  const isFavorited = ref(false);
  const loading = ref(true);
  const sortPrice = ref('');
  const sortType = ref('');
  const userId = ref('');

  const init = () => {
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(urlHash.replace('#', '').split('?')[1] || '');
    const id = urlParams.get('id');

    sortPrice.value = urlParams.get('sortPrice') || ''; 
    sortType.value = urlParams.get('sortType') || ''; 
    console.log(sortPrice.value, sortType.value)

    fetchProductData(id);
  };

  const fetchProductData = async (id) => {
    if (id) {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        
        const discountedProducts = JSON.parse(localStorage.getItem('discountedProducts')) || [];
        const discountedProduct = discountedProducts.find(p => p.id === parseInt(id));
        if (discountedProduct) {
          product.value = {
            ...data,
            discountedPrice: discountedProduct.discountedPrice,
            discountPercentage: discountedProduct.discountPercentage,
            saleEndDate: discountedProduct.saleEndDate
          };
        } else {
          product.value = {
            ...data,
            discountedPrice: null,
            discountPercentage: null,
            saleEndDate: null
          };
          init()
        }
        
        isFavorited.value = checkWishlist(data.id);
      } catch (err) {
        console.error('Error fetching product data:', err);
        product.value = {
          title: 'Product not found.',
          image: '',
          price: 'N/A',
          description: '',
          category: 'N/A',
          rating: null,
          discountedPrice: null,
          discountPercentage: null,
          saleEndDate: null
        };
      } finally {
        loading.value = false;
        updateBackLink();
      }
    } else {
      product.value = {
        title: 'Product not found.',
        image: '',
        price: 'N/A',
        description: '',
        category: 'N/A',
        rating: null,
        discountedPrice: null,
        discountPercentage: null,
        saleEndDate: null
      };
      loading.value = false;
      updateBackLink();
    }
  };

  const updateBackLink = () => {
    const backLink = document.getElementById('backLink');
    if (backLink) {
      const url = new URL(window.location.href);
      url.hash = `/${localStorage.getItem('prePath')}?sortPrice=${sortPrice.value}&sortType=${sortType.value}`;
      backLink.href = url.toString();
    }
  };

  const checkWishlist = (productId) => {
    // Implement your wishlist check logic here
    return false;
  };

  onMounted(() => {
    init();

    window.addEventListener('popstate', () => {
      init();
    });
  });

  return {
    product,
    isFavorited,
    loading,
    sortPrice,
    sortType,
    userId,
    updateBackLink,
    checkWishlist, // Ensure this method is exposed
    fetchProductDetail: fetchProductData, // Ensure this method is exposed
    init
  };
}
