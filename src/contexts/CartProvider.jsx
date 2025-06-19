// src/contexts/CartProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { CartContext } from './cart-context.js';

const CART_STORAGE_KEY = 'carrethreeGuestCart';

const fetchAuthenticated = async (url, options = {}, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    return data;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      return [];
    }
  });

  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    const syncCart = async () => {
      if (!isAuthenticated || !currentUser?.token) {
          const localData = localStorage.getItem(CART_STORAGE_KEY);
          setCartItems(localData ? JSON.parse(localData) : []);
          return;
      }
      
      const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      if (localCart.length > 0) {
        const itemsToMerge = localCart.map(item => ({ _id: item.product._id, quantity: item.quantity }));
        try {
          const mergedCart = await fetchAuthenticated('http://localhost:5000/api/cart/merge', { method: 'POST', body: JSON.stringify({ cartItems: itemsToMerge }) }, currentUser.token);
          localStorage.removeItem(CART_STORAGE_KEY);
          setCartItems(mergedCart);
        } catch (error) { console.error("Falha ao fundir carrinhos:", error); }
      } else {
        try {
          const userCart = await fetchAuthenticated('http://localhost:5000/api/cart', {}, currentUser.token);
          setCartItems(userCart);
        } catch (error) { console.error("Falha ao buscar carrinho do usuário:", error); }
      }
    };
    syncCart();
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addItem = useCallback(async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await fetchAuthenticated('http://localhost:5000/api/cart/add', { method: 'POST', body: JSON.stringify({ productId: product._id, quantity }) }, currentUser.token);
        setCartItems(updatedCart);
      } catch (error) { console.error("Erro ao adicionar item:", error); }
    } else {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product._id === product._id);
        if (existingItem) {
          return prevItems.map(item => item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...prevItems, { product: product, quantity: quantity }];
      });
    }
  }, [isAuthenticated, currentUser]);

  const removeItem = useCallback(async (productId) => {
    if (isAuthenticated) {
       try {
          const updatedCart = await fetchAuthenticated(`http://localhost:5000/api/cart/remove/${productId}`, { method: 'DELETE' }, currentUser.token);
          setCartItems(updatedCart);
       } catch (error) { console.error("Erro ao remover item:", error); }
    } else {
        setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
    }
  }, [isAuthenticated, currentUser]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }
    if (isAuthenticated) {
        try {
            const updatedCart = await fetchAuthenticated('http://localhost:5000/api/cart/update', { method: 'PUT', body: JSON.stringify({ productId, quantity: newQuantity }) }, currentUser.token);
            setCartItems(updatedCart);
        } catch (error) { console.error("Erro ao atualizar quantidade:", error); }
    } else {
        setCartItems(prevItems => prevItems.map(item => item.product._id === productId ? { ...item, quantity: newQuantity } : item));
    }
  }, [isAuthenticated, currentUser, removeItem]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const updatedCart = await fetchAuthenticated('http://localhost:5000/api/cart/clear', { method: 'DELETE' }, currentUser.token);
        setCartItems(updatedCart);
      } catch (error) { console.error("Erro ao limpar carrinho:", error); }
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, currentUser]);

  // FUNÇÕES DE CÁLCULO SEGURAS
  const getCartTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => {
      // Adiciona verificação para o caso de item ser inválido
      if (item && item.quantity) {
          return total + item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems]);
  
  const getCartTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      // Adiciona verificação para garantir que o produto existe e não é null
      if (item && item.product && typeof item.product.price === 'number') {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  }, [cartItems]);
  
  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalItems,
    getCartTotalPrice,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}