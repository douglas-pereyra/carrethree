// src/contexts/cart-context.js
import { createContext } from 'react';

const defaultCartContextValue = {
  cartItems: [],
  addItem: () => console.warn('addItem chamado fora de um CartProvider'),
  removeItem: () => console.warn('removeItem chamado fora de um CartProvider'),
  updateQuantity: () => console.warn('updateQuantity chamado fora de um CartProvider'),
  clearCart: () => console.warn('clearCart chamado fora de um CartProvider'),
  getCartTotalItems: () => 0,
  getCartTotalPrice: () => 0,
};
export const CartContext = createContext(defaultCartContextValue);