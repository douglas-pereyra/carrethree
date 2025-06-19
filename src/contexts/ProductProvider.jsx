// src/contexts/ProductProvider.jsx
import React, { useState, useEffect } from 'react';
import { ProductContext } from './product-context.js';

export function ProductProvider({ children }) {
  // allProducts: Guarda a lista completa e imutável de todos os produtos do DB.
  const [allProducts, setAllProducts] = useState([]);
  // displayedProducts: Guarda a lista que será exibida na tela (pode ser filtrada por busca ou categoria).
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Busca todos os produtos na carga inicial
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('A resposta da rede não foi ok');
        const data = await response.json();
        setAllProducts(data);
        setDisplayedProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Busca produtos na API usando uma palavra-chave e atualiza APENAS a lista de exibição.
  const searchProducts = async (keyword = '') => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products?keyword=${keyword}`);
      if (!response.ok) throw new Error('A resposta da rede não foi ok');
      const data = await response.json();
      setDisplayedProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Filtra a lista MESTRA por categoria e atualiza a lista de exibição.
  const filterByCategory = (category) => {
    if (category === 'Todos') {
      setDisplayedProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      setDisplayedProducts(filtered);
    }
  };

  // As funções de CUD (Create, Update, Delete) foram atualizadas para manter as duas listas consistentes.
  const addProduct = async (productFormData) => { // Recebe o FormData da página
    try {
      // 1. Pega os dados do utilizador do LocalStorage para obter o token
      // (Esta parte veio da branch 'main')
      const userInfo = JSON.parse(localStorage.getItem('carrethreeAuthUser'));
      const token = userInfo ? userInfo.token : null;

      if (!token) {
        console.error('Nenhum token encontrado, o usuário não está autenticado.');
        return { success: false, message: 'Usuário não autenticado.' };
      }

      // 2. Monta a requisição fetch combinando as duas lógicas
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          // Adiciona o token de autorização
          'Authorization': `Bearer ${token}`,
          // IMPORTANTE: NÃO defina o 'Content-Type' aqui. 
          // O navegador fará isso automaticamente para FormData.
        },
        body: productFormData, // Envia o FormData diretamente no corpo (da sua branch)
      });

      // 3. Trata a resposta (lógica padrão)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o produto na API');
      }

      const createdProduct = await response.json();

      setAllProducts(prev => [...prev, createdProduct]);
      setDisplayedProducts(prev => [...prev, createdProduct]);

      return { success: true, product: createdProduct };

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('carrethreeAuthUser'));
      const token = userInfo ? userInfo.token : null;

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: updatedData, // Envia o FormData diretamente
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Falha ao atualizar o produto');
      }

      const updatedProductFromServer = await response.json();
      const updateList = (list) => list.map(p => p._id === updatedProductFromServer._id ? updatedProductFromServer : p);
      setAllProducts(updateList);
      setDisplayedProducts(updateList);
      return { success: true, product: updatedProductFromServer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('carrethreeAuthUser'));
      const token = userInfo ? userInfo.token : null;

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          // 3. Adiciona o token também na requisição de apagar
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Falha ao apagar o produto');
      }

      const filterList = (list) => list.filter(p => p._id !== productId);
      setAllProducts(filterList);
      setDisplayedProducts(filterList);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getProductById = (productId) => {
    // Busca sempre na lista mestra para garantir que encontrará o produto, mesmo se a exibição estiver filtrada.
    return allProducts.find(p => p._id === productId);
  };

  const value = {
    products: displayedProducts, // Para ProductList
    allProducts: allProducts,     // Para CategoryBar
    isLoadingProducts,
    searchProducts,
    filterByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
