// src/pages/HomePage.jsx
import React from 'react';
import ProductList from '../components/product/ProductList';

// HomePage não precisa mais receber ou gerenciar props de filtro.
// O componente ProductList pegará a lista de exibição correta diretamente do contexto.
function HomePage() {
  return (
    <>
      <ProductList />
    </>
  );
}

export default HomePage;
