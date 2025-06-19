/**
 * @fileoverview Creates the shopping cart context for the application.
 * This file defines the default "shape" of the cart data and functions.
 */

import { createContext } from 'react';

// Defines the default structure and values for the CartContext.
const defaultCartContextValue = {
  // A safety flag used by the useCart hook.
  _isDefault: true,
  cartItems: [],

  // Placeholder functions that log warnings if called outside of a CartProvider.
  addItem: () => console.warn('addItem called outside of a CartProvider'),
  removeItem: () => console.warn('removeItem called outside of a CartProvider'),
  updateQuantity: () => console.warn('updateQuantity called outside of a CartProvider'),
  clearCart: () => console.warn('clearCart called outside of a CartProvider'),
  getCartTotalItems: () => 0,
  getCartTotalPrice: () => 0,
};

// Creates the cart context object.
export const CartContext = createContext(defaultCartContextValue);