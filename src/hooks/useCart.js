// src/hooks/useCart.js (VERSÃO SIMPLIFICADA E RECOMENDADA PARA A VERIFICAÇÃO)
import { useContext } from 'react';
import { CartContext } from '../contexts/cart-context.js';

export function useCart() {
  const context = useContext(CartContext);
  // Se o contexto for o valor default (indicado pela função de aviso, por exemplo)
  // OU se for undefined (se não houver valor default em createContext)
  // então o Provider não foi encontrado acima na árvore.
  if (context === undefined || (typeof context.addItem === 'function' && context.addItem.toString().includes('console.warn("addItem chamado fora de um CartProvider")'))) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
