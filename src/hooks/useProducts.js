// src/hooks/useProducts.js
import { useContext } from 'react';
import { ProductContext, defaultProductContextValue } from '../contexts/product-context.js';

export function useProducts() {
  const context = useContext(ProductContext);
  if (
    context === undefined ||
    (typeof context.addProduct === 'function' &&
     context.addProduct.toString() === defaultProductContextValue.addProduct.toString())
  ) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
}