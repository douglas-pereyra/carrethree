// src/contexts/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context.js'; // Seu arquivo auth-context.js exporta AuthContext e defaultAuthContextValue

// Lista pré-definida de e-mails de administradores
const PREDEFINED_ADMIN_EMAILS = [
  'douglas@carrethree.br',
  'henrique@carrethree.br',
  'admin@example.com',
];
const ADMIN_PASSWORD = 'adminpass'; // Senha para os admins da lista

// Mock de usuário comum padrão (pode ser removido se todos os usuários comuns vierem do cadastro)
const MOCK_REGULAR_USER_DATA = {
  id: 'user-0', // ID único para o usuário mockado padrão
  name: 'Usuário Padrão Exemplo',
  email: 'user@example.com',
};
const REGULAR_USER_PASSWORD = 'password';

// Chave para armazenar os usuários registrados no localStorage
const REGISTERED_USERS_STORAGE_KEY = 'registeredCarrethreeUsers';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Para saber quando a verificação inicial terminou
  const [navigatingAfterLogout, setNavigatingAfterLogout] = useState(false); // Para gerenciar redirect pós-logout

  // Função para carregar usuários registrados do localStorage
  const getRegisteredUsers = () => {
    try {
      const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error("Erro ao carregar usuários registrados do localStorage:", error);
      return [];
    }
  };

  // Função para salvar usuários registrados no localStorage
  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Erro ao salvar usuários registrados no localStorage:", error);
    }
  };

  // Verifica o localStorage por um usuário logado na montagem inicial
  useEffect(() => {
    console.log('[AuthProvider] Verificando authUser no localStorage...');
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log('[AuthProvider] Usuário restaurado do localStorage:', user);
      }
    } catch (error) {
      console.error("[AuthProvider] Erro ao carregar authUser do localStorage:", error);
      localStorage.removeItem('authUser'); // Limpa em caso de erro
    }
    setIsLoadingAuth(false); // Finaliza o carregamento inicial da autenticação
  }, []);

  // Efeito para resetar o flag 'navigatingAfterLogout'
  useEffect(() => {
    if (navigatingAfterLogout && !isAuthenticated) {
      const timer = setTimeout(() => {
        console.log('[AuthProvider] Resetando navigatingAfterLogout para false');
        setNavigatingAfterLogout(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [navigatingAfterLogout, isAuthenticated]);

  const login = async (email, password) => {
    console.log('[AuthProvider] Tentativa de login para:', email);
    setNavigatingAfterLogout(false); // Reseta flag em nova tentativa de login
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de API
    const normalizedEmail = email.toLowerCase();

    // 1. Tenta login de Admin
    if (PREDEFINED_ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: `admin-${normalizedEmail}`,
        name: normalizedEmail.split('@')[0], // Ou um nome fixo como "Admin"
        email: normalizedEmail,
        isAdmin: true,
      };
      localStorage.setItem('authUser', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      console.log('[AuthProvider] Login de Administrador bem-sucedido para:', adminUser.name);
      return { success: true, user: adminUser };
    }

    // 2. Tenta login do Usuário Mock Padrão
    if (normalizedEmail === MOCK_REGULAR_USER_DATA.email.toLowerCase() && password === REGULAR_USER_PASSWORD) {
      const regularUser = { ...MOCK_REGULAR_USER_DATA, isAdmin: false };
      localStorage.setItem('authUser', JSON.stringify(regularUser));
      setCurrentUser(regularUser);
      setIsAuthenticated(true);
      console.log('[AuthProvider] Login de Usuário Mock Padrão bem-sucedido para:', regularUser.name);
      return { success: true, user: regularUser };
    }

    // 3. Tenta login de Usuário Registrado dinamicamente no localStorage
    const registeredUsers = getRegisteredUsers();
    const foundRegisteredUser = registeredUsers.find(user => user.email.toLowerCase() === normalizedEmail);

    if (foundRegisteredUser && foundRegisteredUser.password === password) { // ATENÇÃO: Comparação de senha em texto plano!
      const { password: _, ...userToLogin } = foundRegisteredUser; // Remove a senha antes de definir currentUser
      localStorage.setItem('authUser', JSON.stringify(userToLogin));
      setCurrentUser(userToLogin);
      setIsAuthenticated(true);
      console.log('[AuthProvider] Login de Usuário Registrado bem-sucedido para:', userToLogin.name);
      return { success: true, user: userToLogin };
    }
    
    console.log('[AuthProvider] Falha no login para:', email);
    setCurrentUser(null); // Garante que currentUser seja null em falha
    setIsAuthenticated(false); // Garante que isAuthenticated seja false em falha
    return { success: false, message: 'E-mail ou senha inválidos.' };
  };

  const logout = (navigateFunc, redirectTo = '/') => {
    console.log('[AuthProvider] Iniciando logout. Sinalizando navigatingAfterLogout e preparando para redirecionar para:', redirectTo);
    setNavigatingAfterLogout(true);
    localStorage.removeItem('authUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    if (navigateFunc && typeof navigateFunc === 'function') {
      console.log('[AuthProvider] Chamando navigateFunc para', redirectTo);
      navigateFunc(redirectTo, { replace: true });
    }
  };

  const signup = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula delay
    const normalizedEmail = email.toLowerCase();

    // Verifica se é e-mail de admin ou do usuário mock padrão
    if (PREDEFINED_ADMIN_EMAILS.includes(normalizedEmail) || normalizedEmail === MOCK_REGULAR_USER_DATA.email.toLowerCase()) {
      return { success: false, message: 'Este e-mail já está em uso ou é reservado.' };
    }

    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Este e-mail já foi cadastrado.' };
    }

    // Cria novo usuário comum
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      password: password, // ATENÇÃO: Armazenando senha em texto plano - apenas para mock!
      isAdmin: false,
    };

    registeredUsers.push(newUser);
    saveRegisteredUsers(registeredUsers);
    console.log('[AuthProvider] Novo usuário registrado:', newUser.name);

    // Loga automaticamente o novo usuário
    const { password: _, ...userToAuth } = newUser; // Remove a senha do objeto que vai para o estado/localStorage 'authUser'
    
    localStorage.setItem('authUser', JSON.stringify(userToAuth));
    setCurrentUser(userToAuth);
    setIsAuthenticated(true);
    console.log('[AuthProvider] Usuário recém-cadastrado logado automaticamente:', userToAuth.name);

    return { success: true, user: userToAuth, message: 'Cadastro realizado com sucesso! Você já está logado.' };
  };

  const value = {
    isAuthenticated,
    currentUser,
    isLoadingAuth,
    navigatingAfterLogout,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}