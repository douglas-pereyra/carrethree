// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context.js'; // defaultAuthContextValue não é mais necessário aqui

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context._isDefault) { // Verifica _isDefault
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}