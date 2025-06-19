/**
 * @fileoverview Defines the HomePage component, which serves as the main
 * landing page for customers.
 */

import React from 'react';
import ProductList from '../components/product/ProductList';

/**
 * Renders the main homepage of the Carrethree application.
 * This component acts as a simple container. Its only responsibility is to render
 * the ProductList component, which handles the actual display of the products.
 * All data logic is managed by the ProductContext, not this page.
 */
function HomePage() {
  return (
    <>
      <ProductList />
    </>
  );
}

export default HomePage;