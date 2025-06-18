// src/components/product/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

// O componente agora não se preocupa mais com a lógica de busca/filtro.
// Ele apenas renderiza os produtos que estão no estado global.
function ProductList() {
  const { products, isLoadingProducts } = useProducts();

  if (isLoadingProducts) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando produtos...</p>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '20px' }}>
        Nenhum produto encontrado.
      </p>
    );
  }

  return (
    <section className="produtos">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </section>
  );
}

export default ProductList;