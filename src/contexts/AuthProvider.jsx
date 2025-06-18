// src/contexts/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context.js';

const AUTH_USER_STORAGE_KEY = 'carrethreeAuthUser';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro ao carregar authUser do localStorage:", error);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    setIsLoadingAuth(false);
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar o cadastro.');
      }
      
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data));
      setCurrentUser(data);
      setIsAuthenticated(true);
      
      console.log('AuthProvider: SUCESSO! Estado de autenticação definido para TRUE.');
      return { success: true, user: data };
    } catch (err) {
      console.error("AuthProvider: ERRO no signup via API:", err.message);
      return { success: false, message: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar o login.');
      }

      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data));
      setCurrentUser(data);
      setIsAuthenticated(true);
      
      console.log('AuthProvider: SUCESSO! Estado de autenticação definido para TRUE.');
      return { success: true, user: data };
    } catch (err) {
      console.error("AuthProvider: ERRO no login via API:", err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = (navigateFunc) => {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    if (navigateFunc) {
      navigateFunc('/', { replace: true });
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    isLoadingAuth,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}