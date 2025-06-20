/**
 * @fileoverview This file defines the ProductProvider context for the Carrethree application.
 * It is responsible for managing all product-related state, including fetching products from the API,
 * handling search and filtering, and performing admin CRUD (Create, Read, Update, Delete) operations.
 */

import React, { useState, useEffect } from 'react';
import { ProductContext } from './product-context.js';

// --- Constants and Helpers ---

// The base URL for the backend API. Centralizing it here makes it easy to change later.
const API_BASE_URL = 'http://localhost:5000/api/products';

/**
 * A helper function to retrieve the auth token from localStorage.
 * This avoids repeating the same logic in multiple functions.
 * @returns {string|null} The user's auth token or null if not found.
 */
const getToken = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('carrethreeAuthUser'));
    return userInfo ? userInfo.token : null;
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};


export function ProductProvider({ children }) {
  // --- State Management ---

  // `allProducts` holds the complete, unfiltered list of products fetched from the database.
  // This list is used as the "source of truth" for client-side filtering.
  const [allProducts, setAllProducts] = useState([]);

  // `displayedProducts` holds the list of products currently shown to the user.
  // This list can be a filtered subset of `allProducts`.
  const [displayedProducts, setDisplayedProducts] = useState([]);
  
  // `isLoadingProducts` tracks the loading state for fetching operations.
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // --- Data Fetching ---

  // Fetches all products from the API when the component first mounts.
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllProducts(data);
        setDisplayedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []); // The empty dependency array ensures this runs only once on mount.


  // --- Customer-Facing Functions ---

  /**
   * Searches for products via the API using a keyword and updates the displayed list.
   * @param {string} keyword - The search term entered by the user.
   */
  const searchProducts = async (keyword = '') => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE_URL}?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDisplayedProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  /**
   * Filters the master product list by category and updates the displayed list.
   * This operation is performed on the client-side for better performance.
   * @param {string} category - The category to filter by, e.g., "Hortifruti".
   */
  const filterByCategory = (category) => {
    if (category === 'Todos') {
      setDisplayedProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      setDisplayedProducts(filtered);
    }
  };


  // --- Admin CRUD Functions ---

  /**
   * Adds a new product to the database. Requires admin authentication.
   * @param {FormData} productFormData - The new product data, including the image file.
   * @returns {Promise<{success: boolean, message?: string, product?: object}>}
   */
  const addProduct = async (productFormData) => {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Not authenticated.' };
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No 'Content-Type' header needed; the browser sets it for FormData.
        },
        body: productFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product via API');
      }

      const createdProduct = await response.json();
      
      // Update both state lists to keep the UI in sync.
      setAllProducts(prev => [...prev, createdProduct]);
      setDisplayedProducts(prev => [...prev, createdProduct]);

      return { success: true, product: createdProduct };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, message: error.message };
    }
  };

  /**
   * Updates an existing product in the database. Requires admin authentication.
   * @param {string} productId - The ID of the product to update.
   * @param {FormData} updatedData - The updated product data.
   * @returns {Promise<{success: boolean, message?: string, product?: object}>}
   */
  const updateProduct = async (productId, updatedData) => {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Not authenticated.' };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: updatedData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const updatedProductFromServer = await response.json();
      
      // A helper function to update an item in a list.
      const updateList = (list) => list.map(p => p._id === updatedProductFromServer._id ? updatedProductFromServer : p);
      
      // Update both state lists.
      setAllProducts(updateList);
      setDisplayedProducts(updateList);

      return { success: true, product: updatedProductFromServer };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  };

  /**
   * Deletes a product from the database. Requires admin authentication.
   * @param {string} productId - The ID of the product to delete.
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const deleteProduct = async (productId) => {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Not authenticated.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      // A helper function to remove an item from a list.
      const filterList = (list) => list.filter(p => p._id !== productId);
      
      // Update both state lists.
      setAllProducts(filterList);
      setDisplayedProducts(filterList);

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, message: error.message };
    }
  };
  
  // Note: getProductById was removed as it's not being used by any component.
  // The same functionality can be achieved with `allProducts.find(...)` if needed.

  // The value provided to all consuming components.
  const value = {
    products: displayedProducts, // The list for customer-facing components.
    allProducts: allProducts,     // The full list for components like CategoryBar.
    isLoadingProducts,
    searchProducts,
    filterByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}