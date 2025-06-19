/**
 * @fileoverview Creates the product context for the application.
 * This file defines the default "shape" for product-related data and functions.
 */

import { createContext } from 'react';

export const defaultProductContextValue = {
  // A safety flag used by the useProducts hook.
  _isDefault: true,
  products: [],
  allProducts: [], // Added for consistency with what the Provider offers
  isLoadingProducts: true,
  
  // Placeholder functions for admin actions.
  addProduct: async () => {
    console.warn('addProduct called outside of a ProductProvider');
    return { success: false, message: 'ProductProvider not found' };
  },
  updateProduct: async () => {
    console.warn('updateProduct called outside of a ProductProvider');
    return { success: false, message: 'ProductProvider not found' };
  },
  deleteProduct: async () => {
    console.warn('deleteProduct called outside of a ProductProvider');
    return { success: false, message: 'ProductProvider not found' };
  },

  // Placeholder functions for customer actions.
  searchProducts: () => {
    console.warn('searchProducts called outside of a ProductProvider');
  },
  filterByCategory: () => {
    console.warn('filterByCategory called outside of a ProductProvider');
  },
};

// Creates the product context object.
export const ProductContext = createContext(defaultProductContextValue);