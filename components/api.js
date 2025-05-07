// utils/api.js
import axios from 'axios';

// Base URL of your WordPress site
const WORDPRESS_BASE_URL = 'https://asmos.hi-it.com.ua';

const api = axios.create({
  baseURL: WORDPRESS_BASE_URL + '/wp-json/custom/v1',
  withCredentials: true, // Send cookies with each request
});

// Add to cart
export const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/add-to-cart', {
        product_id: productId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

// Get cart contents
export const getCart = async () => {
  try {
    const response = await api.get('/get-cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch products from WooCommerce API
export const fetchProducts = async () => {
  try {
    const consumerKey = 'ck_d4ae025596c46effa71d2d9c6c7a98de33777fc1';
    const consumerSecret = 'cs_e853eca5c77ca8f5f9405ee1efa9dd8eeeed74df';
    const response = await axios.get(
      `${WORDPRESS_BASE_URL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
