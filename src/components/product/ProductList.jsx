/**
 * @fileoverview Defines the ProductList component.
 * This component is responsible for rendering the grid of product cards.
 */

import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

/**
 * Renders a list of products in a grid layout.
 * This component is purely presentational; it gets its data directly from the
 * ProductContext via the useProducts hook and does not contain any filtering or searching logic itself.
 */
function ProductList() {
  // Consume the product state and loading status from the ProductProvider.
  // The `products` array is the already-filtered list ready for display.
  const { products, isLoadingProducts } = useProducts();

  // 1. Handle the loading state: Display a message while products are being fetched.
  if (isLoadingProducts) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando produtos...</p>;
  }

  // 2. Handle the empty state: Display a message if no products are found after loading.
  if (!products || products.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '20px' }}>
        Nenhum produto encontrado.
      </p>
    );
  }

  // 3. Render the list: Map over the products array and render a ProductCard for each one.
  return (
    <section className="produtos">
      {products.map(product => (
        // `product._id` is used as the unique `key`, which is essential for React's performance.
        <ProductCard key={product._id} product={product} />
      ))}
    </section>
  );
}

export default ProductList;