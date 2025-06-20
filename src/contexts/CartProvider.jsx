/**
 * @fileoverview Defines the CartProvider context for the Carrethree application.
 * It manages the shopping cart state using a hybrid approach:
 * - For guest users, it uses localStorage for persistence.
 * - For authenticated users, it syncs the cart with the database via the API.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { CartContext } from './cart-context.js';

// --- Constants and Helpers ---

const API_BASE_URL = 'http://localhost:5000/api/cart';
// Using a specific key for the guest cart to avoid confusion.
const GUEST_CART_STORAGE_KEY = 'carrethreeGuestCart';

/**
 * A helper function to make authenticated fetch requests.
 * It automatically includes the 'Content-Type' and 'Authorization' headers.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Standard fetch options (method, body, etc.).
 * @param {string} token - The user's JWT.
 * @returns {Promise<any>} The JSON response from the server.
 */
const fetchAuthenticated = async (url, options = {}, token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

/**
 * Formats the cart data received from the backend API into the flat structure
 * used by the frontend state.
 * Backend format: [{ product: { ...details }, quantity: X }]
 * Frontend format: [{ ...details, quantity: X }]
 * @param {Array} apiCart - The cart data from the API.
 * @returns {Array} The formatted cart data.
 */
const formatCartData = (apiCart) => {
  if (!Array.isArray(apiCart)) return [];
  return apiCart.map(item => ({ ...item.product, quantity: item.quantity }));
};


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, currentUser } = useAuth();
  
  // This effect handles the initial loading and synchronization of the cart.
  // It runs whenever the user's authentication status changes.
  useEffect(() => {
    const syncAndLoadCart = async () => {
      // If the user is not authenticated, load the cart from localStorage.
      if (!isAuthenticated) {
        const localData = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        setCartItems(localData ? JSON.parse(localData) : []);
        return;
      }
      
      // If the user IS authenticated:
      const token = currentUser?.token;
      if (!token) return;

      // 1. Check for a guest cart in localStorage that needs to be merged.
      const localCart = JSON.parse(localStorage.getItem(GUEST_CART_STORAGE_KEY) || '[]');
      let finalCart = [];

      if (localCart.length > 0) {
        // 2. If a local cart exists, send it to the backend to be merged.
        try {
          const mergedApiCart = await fetchAuthenticated(
            `${API_BASE_URL}/merge`, 
            { method: 'POST', body: JSON.stringify({ cartItems: localCart }) }, 
            token
          );
          finalCart = formatCartData(mergedApiCart);
          // 3. Clear the local guest cart after a successful merge.
          localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        } catch (error) {
          console.error("Failed to merge carts:", error);
          // Fallback: fetch the server cart anyway
          const serverCart = await fetchAuthenticated(API_BASE_URL, {}, token);
          finalCart = formatCartData(serverCart);
        }
      } else {
        // 4. If no local cart exists, just fetch the user's cart from the database.
        try {
          const serverCart = await fetchAuthenticated(API_BASE_URL, {}, token);
          finalCart = formatCartData(serverCart);
        } catch (error) {
          console.error("Failed to fetch user cart:", error);
        }
      }
      setCartItems(finalCart);
    };

    syncAndLoadCart();
  }, [isAuthenticated, currentUser]);

  // This effect saves the cart to localStorage ONLY when the user is a guest.
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  /**
   * Adds an item to the cart. Uses API if logged in, otherwise uses local state.
   */
  const addItem = useCallback(async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const updatedApiCart = await fetchAuthenticated(
          `${API_BASE_URL}/add`, 
          { method: 'POST', body: JSON.stringify({ productId: product._id, quantity }) }, 
          currentUser.token
        );
        setCartItems(formatCartData(updatedApiCart));
      } catch (error) {
        console.error("Error adding item:", error);
      }
    } else {
      // Guest user logic
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item._id === product._id);
        if (existingItem) {
          return prevItems.map(item => 
            item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        // Standardize the item structure to be flat.
        return [...prevItems, { ...product, quantity }];
      });
    }
  }, [isAuthenticated, currentUser]);

  /**
   * Removes an item from the cart. Uses API if logged in, otherwise uses local state.
   */
  const removeItem = useCallback(async (productId) => {
    if (isAuthenticated) {
       try {
          const updatedApiCart = await fetchAuthenticated(
            `${API_BASE_URL}/remove/${productId}`, 
            { method: 'DELETE' }, 
            currentUser.token
          );
          setCartItems(formatCartData(updatedApiCart));
       } catch (error) {
         console.error("Error removing item:", error);
       }
    } else {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    }
  }, [isAuthenticated, currentUser]);

  /**
   * Updates the quantity of an item. Uses API if logged in, otherwise uses local state.
   */
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    // If the new quantity is 0 or less, just remove the item.
    if (newQuantity <= 0) {
      return removeItem(productId);
    }
    
    // Find the item in the current cart to check its stock limit.
    const itemToUpdate = cartItems.find(item => item._id === productId);
    if (!itemToUpdate) return; // Failsafe if item is not found.
    
    // Determine the maximum quantity allowed based on the stock.
    const stockLimit = itemToUpdate.countInStock;
    const quantityToSet = Math.min(newQuantity, stockLimit);

    if (isAuthenticated) {
      // Authenticated user logic (API call)
      try {
        const updatedApiCart = await fetchAuthenticated(
          `${API_BASE_URL}/update`,
          { method: 'PUT', body: JSON.stringify({ productId, quantity: quantityToSet }) },
          currentUser.token
        );
        setCartItems(formatCartData(updatedApiCart));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      // Guest user logic (local state)
      setCartItems(prevItems => prevItems.map(item => 
        item._id === productId 
            ? { ...item, quantity: quantityToSet } 
            : item
      ));
    }
  }, [isAuthenticated, currentUser, cartItems, removeItem]);

  /**
   * Clears the entire cart. Uses API if logged in, otherwise uses local state.
   */
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await fetchAuthenticated(`${API_BASE_URL}/clear`, { method: 'DELETE' }, currentUser.token);
        setCartItems([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, currentUser]);
  
  // Memoized functions to calculate totals.
  const getCartTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);
  
  const getCartTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);
  
  // The value provided to all consuming components.
  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalItems,
    getCartTotalPrice,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}