// src/components/product/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

function ProductList({ selectedCategory, searchedName }) {
  const { products, isLoadingProducts } = useProducts();

  console.log('[ProductList] Categoria Selecionada:', selectedCategory);
  console.log('[ProductList] Termo de Busca:', searchedName);
  console.log('[ProductList] isLoadingProducts:', isLoadingProducts);
  console.log('[ProductList] products (antes do filtro):', products);

  if (isLoadingProducts) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando produtos...</p>;
  }

  // Filtra por categoria
  const filteredProducts = selectedCategory && selectedCategory !== 'Todos'
    ? products.filter(product => product.category === selectedCategory)
    : products;

  // Filtra por termo de busca (case-insensitive e sem remover espaços)
  const filteredSearchedProducts = searchedName && searchedName.trim() !== ''
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchedName.toLowerCase()))
    : filteredProducts;

  console.log('[ProductList] products (depois do filtro e da busca):', filteredSearchedProducts);

  if (!Array.isArray(filteredSearchedProducts) || filteredSearchedProducts.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '20px' }}>
        {searchedName 
          ? `Nenhum produto encontrado para "${searchedName}"${selectedCategory && selectedCategory !== 'Todos' ? ` na categoria ${selectedCategory}` : ''}`
          : `Nenhum produto encontrado${selectedCategory && selectedCategory !== 'Todos' ? ` na categoria ${selectedCategory}` : ''}`
        }
      </p>
    );
  }

  return (
    <section className="produtos">
      {filteredSearchedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

export default ProductList;