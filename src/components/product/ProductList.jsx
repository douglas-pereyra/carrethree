// src/components/product/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

function ProductList({ selectedCategory }) { // Recebe a categoria selecionada
  const { products, isLoadingProducts } = useProducts();

  console.log('[ProductList] Categoria Selecionada:', selectedCategory);
  console.log('[ProductList] isLoadingProducts:', isLoadingProducts);
  console.log('[ProductList] products (antes do filtro):', products);

  if (isLoadingProducts) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando produtos...</p>;
  }

  // Filtra os produtos
  const filteredProducts = selectedCategory && selectedCategory !== 'Todos'
    ? products.filter(product => product.category === selectedCategory)
    : products; // Se "Todos" ou nenhuma categoria, mostra todos

  console.log('[ProductList] products (depois do filtro):', filteredProducts);

  if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Nenhum produto encontrado para esta categoria.</p>;
  }

  return (
    <section className="produtos">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

export default ProductList;