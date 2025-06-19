/**
 * @fileoverview A custom React hook for accessing the shopping cart context.
 * This hook simplifies consuming cart state and functions in components.
 */

import { useContext } from 'react';
import { CartContext } from '../contexts/cart-context.js';

/**
 * A custom hook that provides easy access to the CartContext.
 * It returns the context's value, which includes the cart items and action methods.
 * It also includes a safety check to ensure it is used within a <CartProvider>.
 *
 * @returns {object} The cart context value, containing:
 * - cartItems (Array)
 * - addItem (function)
 * - removeItem (function)
 * - updateQuantity (function)
 * - clearCart (function)
 * - and more...
 */
export function useCart() {
  // Access the context value provided by the nearest CartProvider.
  const context = useContext(CartContext);

  // Safety check: Throws an error if the hook is used outside of a CartProvider.
  // This makes debugging much easier by preventing common mistakes.
  if (context === undefined || context._isDefault) {
    throw new Error('useCart must be used within a CartProvider');
  }

  // Return the full context value to the component.
  return context;
}