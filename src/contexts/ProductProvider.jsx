// src/contexts/ProductProvider.jsx
import React, { useState, useEffect } from 'react';
import { ProductContext } from './product-context.js';
import initialMockProducts from '../data/mockProducts.js'; // Seus dados mockados estáticos

// Função para obter os produtos iniciais.
// Agora assume que initialMockProducts já usa strings para caminhos de imagem.
const getInitialProducts = () => {
  // Retorna uma cópia profunda para evitar mutações no array importado.
  try {
    return JSON.parse(JSON.stringify(initialMockProducts));
  } catch (e) {
    console.error("Erro ao clonar produtos iniciais (getInitialProducts):", e);
    return []; // Retorna vazio em caso de erro na clonagem
  }
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    console.log("[ProductProvider] useEffect: Carregando produtos...");
    try {
      const storedProducts = localStorage.getItem('managedProducts');
      if (storedProducts) {
        console.log("[ProductProvider] Produtos encontrados no localStorage.");
        setProducts(JSON.parse(storedProducts));
      } else {
        console.log("[ProductProvider] Sem produtos no localStorage, usando mocks iniciais.");
        const initialProducts = getInitialProducts();
        setProducts(initialProducts);
        localStorage.setItem('managedProducts', JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error("[ProductProvider] Erro ao carregar/parsear produtos do localStorage. Usando mocks.", error);
      const initialProducts = getInitialProducts();
      setProducts(initialProducts); // Fallback
      if (initialProducts.length > 0) { // Só salva se os mocks não estiverem vazios
          localStorage.setItem('managedProducts', JSON.stringify(initialProducts));
      }
    }
    setIsLoadingProducts(false);
    console.log("[ProductProvider] Carregamento de produtos finalizado. isLoadingProducts:", false);
  }, []);

  const updateLocalStorage = (updatedProducts) => {
    localStorage.setItem('managedProducts', JSON.stringify(updatedProducts));
  };

  const addProduct = async (productData) => {
    console.log("[ProductProvider] Adicionando produto:", productData);
    const newProduct = {
      ...productData,
      id: Date.now().toString(), // ID único simples
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);
    return newProduct;
  };

  const updateProduct = async (productId, updatedData) => {
    console.log(`[ProductProvider] Atualizando produto ID ${productId}:`, updatedData);
    let foundProduct = null;
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        foundProduct = { ...p, ...updatedData };
        return foundProduct;
      }
      return p;
    });
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);
    return foundProduct;
  };

  const deleteProduct = async (productId) => {
    console.log(`[ProductProvider] Deletando produto ID ${productId}`);
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);
  };

  const getProductById = (productId) => {
    return products.find(p => p.id === productId);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    isLoadingProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}