// src/pages/HomePage.jsx
import React from 'react';
import ProductList from '../components/product/ProductList';

// HomePage agora recebe selectedCategory do MainLayout (via App.jsx)
function HomePage({ selectedCategory }) {
  return (
    <>
      {/* A CategoryBar é renderizada pelo MainLayout e passa a categoria selecionada para cá */}
      <ProductList selectedCategory={selectedCategory} />
    </>
  );
}

export default HomePage;