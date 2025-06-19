/**
 * @fileoverview A custom React hook for accessing the product context.
 * This hook simplifies consuming product state and related functions in components.
 */

import { useContext } from 'react';
import { ProductContext } from '../contexts/product-context.js';

/**
 * A custom hook that provides easy access to the ProductContext.
 * It returns the context's value, which includes product lists and action methods.
 * It also includes a safety check to ensure it is used within a <ProductProvider>.
 *
 * @returns {object} The product context value, containing:
 * - products (Array - the list to display)
 * - allProducts (Array - the full, unfiltered list)
 * - isLoadingProducts (boolean)
 * - searchProducts (function)
 * - filterByCategory (function)
 * - addProduct (function)
 * - and more...
 */
export function useProducts() {
  // Access the context value provided by the nearest ProductProvider.
  const context = useContext(ProductContext);

  // Safety check: Throws an error if the hook is used outside of a ProductProvider.
  // We use the `_isDefault` flag for a clean and consistent check.
  if (context === undefined || context._isDefault) {
    throw new Error('useProducts must be used within a ProductProvider');
  }

  // Return the full context value to the component.
  return context;
}