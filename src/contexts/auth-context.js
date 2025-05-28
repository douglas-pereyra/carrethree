// src/contexts/auth-context.js
import { createContext } from 'react';

export const defaultAuthContextValue = {
  _isDefault: true,
  isAuthenticated: false,
  currentUser: null,
  isLoadingAuth: true, // Adicionado para consistência com o que AuthProvider realmente fornece
  // eslint-disable-next-line no-unused-vars
  login: async (email, password) => {
    console.warn('Função login (default) chamada fora de um AuthProvider');
    return { success: false, message: 'AuthProvider não encontrado' };
  },
  logout: () => console.warn('Função logout (default) chamada fora de um AuthProvider'),
  // eslint-disable-next-line no-unused-vars
  signup: async (name, email, password) => { // NOVA FUNÇÃO SIGNUP
    console.warn('Função signup (default) chamada fora de um AuthProvider');
    return { success: false, message: 'AuthProvider não encontrado' };
  },
};

export const AuthContext = createContext(defaultAuthContextValue);