// src/contexts/ProductProvider.jsx
import React, { useState, useEffect } from 'react';
import { ProductContext } from './product-context.js';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Este useEffect agora busca os dados da nossa API real quando o app carrega
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("[ProductProvider] Buscando produtos da API real...");
      try {
        // A mágica acontece aqui!
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos da API');
        }

        const data = await response.json();
        setProducts(data); // Atualiza nosso estado global com os produtos reais
        console.log("[ProductProvider] Produtos carregados da API!", data);

      } catch (error) {
        console.error("[ProductProvider] Erro ao buscar produtos:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []); // O array vazio [] garante que isso rode apenas uma vez.

  // --- ATENÇÃO ---
  // As funções abaixo ainda não estão conectadas ao backend.
  // Elas apenas modificam o estado localmente. Faremos isso nos próximos passos.
  const addProduct = async (productData) => {
    try {
      // Fazendo a requisição POST para o nosso backend
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData), // Converte o objeto do formulário para JSON
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o produto na API');
      }

      const createdProduct = await response.json(); // Pega o produto recém-criado da resposta

      // Atualiza o estado do frontend com o novo produto, para que a tela
      // seja atualizada automaticamente, sem precisar recarregar a página.
      setProducts(prevProducts => [...prevProducts, createdProduct]);
      
      console.log('Produto adicionado com sucesso:', createdProduct);
      return { success: true, product: createdProduct };

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT', // Usando o método PUT que criamos no backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o produto na API');
      }

      const updatedProductFromServer = await response.json();

      // Atualiza a lista de produtos no estado do frontend para refletir a mudança
      // sem precisar recarregar a página.
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === updatedProductFromServer._id ? updatedProductFromServer : p
        )
      );

      return { success: true, product: updatedProductFromServer };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar o produto na API');
      }

      // Se a deleção no backend foi um sucesso, removemos o produto
      // da nossa lista no estado do frontend para a tela atualizar na hora.
      setProducts(prevProducts =>
        prevProducts.filter(p => p._id !== productId)
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return { success: false, message: error.message };
    }
  };

  const getProductById = (productId) => {
    // Agora o ID vem do MongoDB (_id), então comparamos com ele.
    return products.find(p => p._id === productId);
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