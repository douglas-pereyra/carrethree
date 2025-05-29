// src/pages/HomePage.jsx
import React from 'react';
import ProductList from '../components/product/ProductList';

// HomePage agora recebe selectedCategory do MainLayout (via App.jsx)
function HomePage({ selectedCategory, searchedName }) {
  return (
    <>
      {/* A CategoryBar é renderizada pelo MainLayout e passa a categoria selecionada para cá */}
      <ProductList selectedCategory={selectedCategory} searchedName={searchedName}/>
    </>
  );
}

export default HomePage;