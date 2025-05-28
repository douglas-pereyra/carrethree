// src/contexts/product-context.js
import { createContext } from 'react';

export const defaultProductContextValue = {
  products: [],
  // eslint-disable-next-line no-unused-vars
  addProduct: async (productData) => {
    console.warn('addProduct fora do ProductProvider');
    return null;
  },
  // eslint-disable-next-line no-unused-vars
  updateProduct: async (productId, productData) => {
    console.warn('updateProduct fora do ProductProvider');
    return null;
  },
  // eslint-disable-next-line no-unused-vars
  deleteProduct: async (productId) => {
    console.warn('deleteProduct fora do ProductProvider');
  },
  // eslint-disable-next-line no-unused-vars
  getProductById: (productId) => {
    console.warn('getProductById fora do ProductProvider');
    return undefined;
  },
  isLoadingProducts: true,
};

export const ProductContext = createContext(defaultProductContextValue);